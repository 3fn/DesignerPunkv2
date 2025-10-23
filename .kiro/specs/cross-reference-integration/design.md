# Design Document: Cross-Reference Integration

**Date**: October 22, 2025
**Spec**: cross-reference-integration
**Status**: Design Phase
**Dependencies**: None (improves existing documentation)

---

## Overview

This design establishes cross-reference standards and integrates cross-references across active documentation to create efficient navigation within current project documentation. The implementation focuses on three key areas:

1. **Standards Documentation**: Add Cross-Reference Standards section to File Organization Standards
2. **Token System Overview**: Create master document mapping token files to their documentation guides
3. **Guide Integration**: Add cross-references between typography-token-expansion guides for related concepts

The design follows the principle of "internal navigation" - cross-references connect current, active documentation (guides, specs, completion docs) without referencing historical preserved knowledge.

---

## Architecture

### Cross-Reference Pattern

```
Active Documentation Network
    ↓
Guide ←→ Guide (related concepts)
    ↓
Completion Doc → Guide (created artifacts)
    ↓
Token System Overview → Guides (documentation)
```

**Key principle**: Cross-references enable navigation within active documentation, not to historical preserved knowledge.

### Document Types and Cross-Reference Usage

```
✅ MUST use cross-references:
├── Documentation guides (.kiro/specs/*/[guide-name].md)
├── Completion documents (task-completion.md)
├── Token System Overview (docs/token-system-overview.md)
└── README files

❌ MUST NOT use cross-references:
├── Token definition files (FontSizeTokens.ts, TypographyTokens.ts)
├── Component implementation files
├── Utility function files
└── Production code
```

---

## Components and Interfaces

### 1. Cross-Reference Standards Section

**Location**: `.kiro/steering/File Organization Standards.md`

**Structure**:
```markdown
## Cross-Reference Standards

### When to Use Cross-References
[Rules for where cross-references belong]

### When NOT to Use Cross-References
[Rules for where cross-references don't belong]

### How to Format Cross-References
[Patterns with examples]

### Common Cross-Reference Patterns
[Specific examples for guide-to-guide, completion-to-guide, overview-to-guide]
```

**Integration point**: Added as new section before "## Troubleshooting" in File Organization Standards

### 2. Token System Overview Document

**Location**: `docs/token-system-overview.md`

**Structure**:
```markdown
# Token System Overview

## Introduction
[Brief overview of token architecture]

## Primitive Tokens

### Font Size Tokens
- **File**: src/tokens/FontSizeTokens.ts
- **Description**: [Brief description]
- **Base Value**: 16px
- **Scale**: 1.125 modular scale

[Repeat for all primitive token types]

## Semantic Tokens

### Typography Tokens
- **File**: src/tokens/semantic/TypographyTokens.ts
- **Description**: [Brief description]
- **Related Guides**:
  - [Compositional Color Guide](../kiro/specs/typography-token-expansion/compositional-color-guide.md)
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md)
  - [Inline Emphasis Guide](../.kiro/specs/typography-token-expansion/inline-emphasis-guide.md)
  - [Migration Guide](../.kiro/specs/typography-token-expansion/migration-guide.md)

[Repeat for all semantic token types]

## Related Documentation
[Links to specs and guides]
```

### 3. Typography Guide Updates

**Files to update**:
- `.kiro/specs/typography-token-expansion/compositional-color-guide.md`
- `.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md`
- `.kiro/specs/typography-token-expansion/inline-emphasis-guide.md`
- `.kiro/specs/typography-token-expansion/migration-guide.md`

**Update pattern**:
```markdown
## Related Guides

- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains why labelXs exists but bodyXs doesn't
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## [Section Title]

[Existing content]
```

---

## Design Decisions

### Decision 1: Skip Preserved Knowledge Cross-References

**Options Considered**:
1. Cross-reference to preserved knowledge as single source of truth
2. Update preserved knowledge first, then cross-reference
3. Skip preserved knowledge cross-references entirely (CHOSEN)

**Decision**: Skip preserved knowledge cross-references

**Rationale**:

Preserved knowledge served as historical foundation during initial project development but represents thinking from an earlier phase. The project has evolved beyond those initial architectural decisions, and cross-referencing to preserved knowledge would:

1. **Bind to outdated thinking**: Preserved knowledge reflects historical decisions that may no longer represent current approach
2. **Prevent evolution**: Cross-references create dependency on potentially stale content, making it harder to evolve thinking in active documentation
3. **Create false authority**: Referencing preserved knowledge implies it's current truth when it's actually historical context

Instead, focus on cross-references within active documentation (guides, specs, completion docs) that represent current thinking and implementation.

**Trade-offs**:
- ✅ **Gained**: Freedom to evolve thinking without updating historical docs, focus on current documentation
- ❌ **Lost**: Connection to historical architectural rationale, "single source of truth" for principles
- ⚠️ **Risk**: Might lose valuable historical context, could duplicate concepts across guides

**Counter-Arguments**:
- **Argument**: "Preserved knowledge contains valuable architectural principles that should be referenced"
- **Response**: Preserved knowledge is valuable as historical context for future comparison, but not as active reference material. The project has evolved beyond those initial principles, and binding current documentation to historical thinking would prevent further evolution.

- **Argument**: "Without preserved knowledge as single source of truth, we'll duplicate architectural explanations across guides"
- **Response**: Guides should focus on application-specific details, not general architectural principles. If duplication occurs, it indicates concepts that should be documented in current (not historical) architectural documentation. We can create new "current principles" documentation if needed, but preserved knowledge isn't that.

### Decision 2: Focus on Guide-to-Guide Cross-References

**Options Considered**:
1. Cross-reference from guides to preserved knowledge
2. Cross-reference between guides for related concepts (CHOSEN)
3. No cross-references at all (keep guides isolated)

**Decision**: Cross-reference between guides for related concepts

**Rationale**:

Typography guides discuss related concepts that benefit from cross-references:
- Compositional color guide discusses token design → relates to strategic flexibility
- Strategic flexibility guide discusses labelXs decision → relates to compositional architecture
- Inline emphasis guide discusses why emphasis isn't in tokens → relates to compositional architecture
- Migration guide discusses renamed tokens → relates to all other guides

Cross-referencing between guides enables efficient navigation without binding to historical preserved knowledge. Developers can discover related concepts within current documentation.

**Trade-offs**:
- ✅ **Gained**: Efficient navigation between related current documentation, discovery of related concepts
- ❌ **Lost**: Connection to historical architectural rationale
- ⚠️ **Risk**: Guides might become too interconnected, creating maintenance burden

**Counter-Arguments**:
- **Argument**: "Guide-to-guide cross-references create tight coupling between guides"
- **Response**: Cross-references are navigation aids, not dependencies. Guides remain standalone readable, but cross-references help readers discover related information. This is standard documentation practice (see: Wikipedia, MDN, any technical documentation).

- **Argument**: "If guides discuss related concepts, maybe they should be combined into one guide"
- **Response**: Each guide has a specific focus (compositional color, strategic flexibility, inline emphasis, migration). Combining them would create an unwieldy mega-guide. Cross-references enable focused guides while maintaining discoverability.

### Decision 3: Add Cross-Reference Standards to File Organization Standards

**Options Considered**:
1. Create new Cross-Reference Standards steering document
2. Add to Development Workflow
3. Add to File Organization Standards (CHOSEN)

**Decision**: Add to File Organization Standards

**Rationale**:

File Organization Standards is the appropriate location because:
- It's Tier 1 (always read by AI agents)
- It focuses on documentation structure and organization
- It's comprehensive about documentation practices
- It avoids creating another steering document

Cross-reference standards are about **how to structure documentation content**, which aligns with file organization's focus on documentation practices. The standards already cover metadata, completion documentation, and organization patterns - cross-reference standards fit this scope.

**Trade-offs**:
- ✅ **Gained**: Standards always available, no new document to maintain, fits thematic focus
- ❌ **Lost**: File Organization Standards becomes longer
- ⚠️ **Risk**: File Organization Standards might become too comprehensive

**Counter-Arguments**:
- **Argument**: "Cross-references are about content, not file organization"
- **Response**: File Organization Standards already covers documentation practices beyond just file placement (metadata, completion documentation, organization patterns). Cross-reference standards are another documentation practice that fits this scope.

- **Argument**: "A dedicated Cross-Reference Standards document would be clearer"
- **Response**: We're trying to avoid document proliferation. File Organization Standards is already Tier 1 and covers documentation practices. Adding cross-reference standards there ensures they're always available without creating another document to maintain.

### Decision 4: Token System Overview Links to Guides (Not Preserved Knowledge)

**Options Considered**:
1. Token System Overview links to preserved knowledge for architectural principles
2. Token System Overview links to current guides for documentation (CHOSEN)
3. Token System Overview has no cross-references (just lists files)

**Decision**: Token System Overview links to current guides

**Rationale**:

Token System Overview should help developers navigate from token files to their documentation. The relevant documentation is in current guides (compositional-color-guide.md, strategic-flexibility-guide.md, etc.), not in historical preserved knowledge.

For typography tokens specifically, the typography-token-expansion guides provide:
- Compositional color architecture (why typography tokens don't include color)
- Strategic flexibility rationale (why labelXs exists but bodyXs doesn't)
- Inline emphasis patterns (platform-native approaches)
- Migration guidance (old names → new names)

These guides represent current thinking and implementation, making them the appropriate cross-reference targets.

**Trade-offs**:
- ✅ **Gained**: Navigation to current, relevant documentation
- ❌ **Lost**: Connection to historical architectural rationale
- ⚠️ **Risk**: Token System Overview might become outdated if guides change

**Counter-Arguments**:
- **Argument**: "Token System Overview should explain architectural principles, not just link to guides"
- **Response**: Token System Overview is a navigation document, not an architectural document. Its purpose is to map token files to their documentation, not to explain architecture. The guides provide the explanations.

- **Argument**: "Linking to guides creates dependency on spec-specific documentation"
- **Response**: That's the point - guides are where the current documentation lives. If guides become outdated, they should be updated or replaced. Token System Overview should always point to current documentation, wherever that is.

---

## Data Models

### Cross-Reference Format

```markdown
## Related Guides

- [Guide Name](./relative-path-to-guide.md) - Brief description of relevance

---

## [Section Title]

[Section content]
```

**Components**:
- **Guide name**: Human-readable name of related guide
- **Relative path**: Path from current document to related guide
- **Relevance description**: Brief explanation of why the guide is relevant

### Token System Overview Entry Format

```markdown
### [Token Type Name]

- **File**: [relative/path/to/TokenFile.ts]
- **Description**: [Brief description]
- **Base Value**: [Base value if applicable]
- **Related Guides**: [Links to relevant guides if applicable]
```

**Example**:
```markdown
### Typography Tokens

- **File**: `src/tokens/semantic/TypographyTokens.ts`
- **Description**: Semantic typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives
- **Related Guides**:
  - [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md) - Explains why typography tokens don't include color
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md) - Explains size variant decisions
  - [Inline Emphasis Guide](../.kiro/specs/typography-token-expansion/inline-emphasis-guide.md) - Explains platform-native emphasis patterns
  - [Migration Guide](../.kiro/specs/typography-token-expansion/migration-guide.md) - Provides migration path for renamed tokens
```

---

## Error Handling

### Broken Cross-Reference Links

**Scenario**: Cross-reference link points to document that doesn't exist or has moved

**Handling**:
- File organization automation validates cross-reference integrity when files move
- Manual validation during documentation updates
- Broken links should be fixed immediately when discovered
- Use relative paths to minimize breakage when repository structure changes

### Missing Related Guides

**Scenario**: Guide references related guide that doesn't exist yet

**Handling**:
- Don't add cross-reference until related guide exists
- Document in completion docs that cross-reference should be added when related guide is created
- Revisit cross-references when new guides are added

### Circular Cross-References

**Scenario**: Guide A references Guide B, which references Guide A

**Handling**:
- Circular references are acceptable for bidirectional navigation
- Ensure circular references provide value (navigation) not confusion
- Use "Related Guides" section to make bidirectional relationships clear

---

## Testing Strategy

### Cross-Reference Validation

**Link integrity**:
- Verify all cross-reference links resolve to existing documents
- Verify relative paths are correct from document location
- Test navigation by clicking links in rendered markdown

**Pattern consistency**:
- Verify cross-references use relative paths
- Verify cross-references include relevance descriptions
- Verify "Related Guides" sections are consistently formatted

### Documentation Quality

**Content validation**:
- Verify guides reference related guides for related concepts
- Verify guides remain standalone readable (cross-references are navigation aids, not dependencies)
- Verify cross-references add value (help discover related information)

**Navigation validation**:
- Verify developers can navigate from guide to related guide in 1 click
- Verify Token System Overview enables navigation from token type to relevant guides
- Verify completion docs link to guides they created

---

## Integration Points

### File Organization Standards

Cross-Reference Standards section integrates with existing File Organization Standards:
- Added before "## Troubleshooting" section
- References existing organization metadata patterns
- Aligns with existing documentation practices

### Typography Token Expansion Guides

Cross-references integrate with existing typography guides:
- Add "Related Guides" section at beginning of each guide
- Maintain all existing content
- Cross-references are navigation aids, not content replacement

### Token System Overview

Token System Overview integrates with:
- Token definition files (provides navigation to files)
- Typography guides (provides navigation to documentation)
- README (can be referenced from README for token system overview)

---

## Documentation Requirements

### Cross-Reference Standards

**Required content**:
- When to use cross-references (documentation yes, code no)
- How to format cross-references (relative paths, relevance descriptions)
- Common cross-reference patterns (guide-to-guide, completion-to-guide, overview-to-guide)
- Anti-patterns (cross-references in production code)

### Token System Overview

**Required content**:
- Introduction to token system
- Primitive tokens section with file paths and descriptions
- Semantic tokens section with file paths, descriptions, and related guides
- Related documentation section

### Guide Updates

**Required updates**:
- Add "Related Guides" section to each typography guide
- Maintain existing content
- Use relative paths for all cross-references
- Include relevance descriptions for each cross-reference

---

*This design document establishes the architecture for efficient navigation within active documentation through cross-references, while maintaining separation from historical preserved knowledge and ensuring production code remains free of cross-references.*
