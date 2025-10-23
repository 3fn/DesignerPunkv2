# Design Document: Typography Token Expansion

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Status**: Design Phase
**Dependencies**: None (extends existing typography tokens)

---

## Overview

This design expands the DesignerPunk typography token system by adding size variants for label, code, and button text styles, and renaming existing body/button tokens for naming consistency. The expansion maintains the mathematical foundation and compositional architecture of the existing system while addressing real-world UI needs.

The design follows these core principles:
- **Mathematical Foundation**: All typography tokens reference primitive tokens that follow the 1.125 modular scale
- **Compositional Architecture**: Typography defines structure (size, weight, line-height, family), color applied separately
- **Strategic Flexibility**: Size variants added where clear use cases exist, not for perfect symmetry
- **Cross-Platform Consistency**: Same mathematical relationships across web, iOS, and Android

---

## Architecture

### Token Structure

Typography tokens follow the existing multi-primitive composition pattern:

```typescript
interface TypographyToken {
  name: string;
  primitiveReferences: {
    fontSize: string;      // Reference to fontSize primitive
    lineHeight: string;    // Reference to lineHeight primitive
    fontFamily: string;    // Reference to fontFamily primitive
    fontWeight: string;    // Reference to fontWeight primitive
    letterSpacing: string; // Reference to letterSpacing primitive
  };
  category: SemanticCategory.TYPOGRAPHY;
  context: string;         // Usage context description
  description: string;     // Detailed description
}
```

**No color property** - maintains compositional architecture where color is applied separately.

### Size Scale System

The typography system uses a four-size scale for most token families:

```
Xs (Extra Small) - fontSize050 (13px) - Only for labels
Sm (Small)       - fontSize075 (14px) - All families
Md (Medium)      - fontSize100 (16px) - All families (base size)
Lg (Large)       - fontSize125 (18px) - All families
```

**Strategic Flexibility**: Only labels include Xs variant due to floating label UI pattern requirements.

### Token Families

```
Body Family (3 tokens)
├── typography.bodySm   (14px, weight 400, reading content)
├── typography.bodyMd   (16px, weight 400, reading content)
└── typography.bodyLg   (18px, weight 400, reading content)

Label Family (4 tokens)
├── typography.labelXs  (13px, weight 500, floating labels)
├── typography.labelSm  (14px, weight 500, UI labels)
├── typography.labelMd  (16px, weight 500, UI labels)
└── typography.labelLg  (18px, weight 500, UI labels)

Code Family (3 tokens)
├── typography.codeSm   (14px, weight 400, monospace)
├── typography.codeMd   (16px, weight 400, monospace)
└── typography.codeLg   (18px, weight 400, monospace)

Button Family (3 tokens)
├── typography.buttonSm (14px, weight 500, button text)
├── typography.buttonMd (16px, weight 500, button text)
└── typography.buttonLg (18px, weight 500, button text)

Existing Tokens (unchanged)
├── typography.h1 through typography.h6 (heading hierarchy)
├── typography.caption (13px, weight 300, image captions)
├── typography.legal (13px, weight 400, fine print)
├── typography.display (42px, weight 700, hero text)
└── typography.input (16px, weight 400, form inputs)
```

---

## Components and Interfaces

### Typography Token Definitions

#### Body Text Variants

```typescript
export const typographyTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'typography.bodySm': {
    name: 'typography.bodySm',
    primitiveReferences: {
      fontSize: 'fontSize075',      // 14px
      lineHeight: 'lineHeight075',  // 1.25
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',  // Normal
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Small body text for secondary content and compact layouts',
    description: 'Small body typography with 14px font size, 1.25 line height, body font family, normal weight'
  },

  'typography.bodyMd': {
    name: 'typography.bodyMd',
    primitiveReferences: {
      fontSize: 'fontSize100',      // 16px
      lineHeight: 'lineHeight100',  // 1.5
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Standard body text for paragraphs and general content',
    description: 'Medium body typography with 16px font size, 1.5 line height, body font family, normal weight'
  },

  'typography.bodyLg': {
    name: 'typography.bodyLg',
    primitiveReferences: {
      fontSize: 'fontSize125',      // 18px
      lineHeight: 'lineHeight125',  // 1.75
      fontFamily: 'fontFamilyBody',
      fontWeight: 'fontWeight400',
      letterSpacing: 'letterSpacing100'
    },
    category: SemanticCategory.TYPOGRAPHY,
    context: 'Large body text for emphasis, lead paragraphs, and prominent content',
    description: 'Large body typography with 18px font size, 1.75 line height, body font family, normal weight'
  }
};
```

#### Label Text Variants

```typescript
'typography.labelXs': {
  name: 'typography.labelXs',
  primitiveReferences: {
    fontSize: 'fontSize050',      // 13px
    lineHeight: 'lineHeight050',  // 1.0
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',  // Medium
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Extra small labels for floating label patterns in form inputs',
  description: 'Extra small label typography with 13px font size, 1.0 line height, body font family, medium weight for floating labels'
},

'typography.labelSm': {
  name: 'typography.labelSm',
  primitiveReferences: {
    fontSize: 'fontSize075',      // 14px
    lineHeight: 'lineHeight075',  // 1.25
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Small labels for compact form fields and UI elements',
  description: 'Small label typography with 14px font size, 1.25 line height, body font family, medium weight'
},

'typography.labelMd': {
  name: 'typography.labelMd',
  primitiveReferences: {
    fontSize: 'fontSize100',      // 16px
    lineHeight: 'lineHeight100',  // 1.5
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Standard labels for form fields and UI elements',
  description: 'Medium label typography with 16px font size, 1.5 line height, body font family, medium weight'
},

'typography.labelLg': {
  name: 'typography.labelLg',
  primitiveReferences: {
    fontSize: 'fontSize125',      // 18px
    lineHeight: 'lineHeight125',  // 1.75
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Large labels for prominent form sections and UI headers',
  description: 'Large label typography with 18px font size, 1.75 line height, body font family, medium weight'
}
```

#### Code Text Variants

```typescript
'typography.codeSm': {
  name: 'typography.codeSm',
  primitiveReferences: {
    fontSize: 'fontSize075',      // 14px
    lineHeight: 'lineHeight075',  // 1.25
    fontFamily: 'fontFamilyMono',
    fontWeight: 'fontWeight400',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Small code text for inline code in compact layouts',
  description: 'Small code typography with 14px font size, 1.25 line height, monospace font family, normal weight'
},

'typography.codeMd': {
  name: 'typography.codeMd',
  primitiveReferences: {
    fontSize: 'fontSize100',      // 16px
    lineHeight: 'lineHeight100',  // 1.5
    fontFamily: 'fontFamilyMono',
    fontWeight: 'fontWeight400',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Standard code text for inline code and code blocks',
  description: 'Medium code typography with 16px font size, 1.5 line height, monospace font family, normal weight'
},

'typography.codeLg': {
  name: 'typography.codeLg',
  primitiveReferences: {
    fontSize: 'fontSize125',      // 18px
    lineHeight: 'lineHeight125',  // 1.75
    fontFamily: 'fontFamilyMono',
    fontWeight: 'fontWeight400',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Large code text for prominent code examples and documentation',
  description: 'Large code typography with 18px font size, 1.75 line height, monospace font family, normal weight'
}
```

#### Button Text Variants

```typescript
'typography.buttonSm': {
  name: 'typography.buttonSm',
  primitiveReferences: {
    fontSize: 'fontSize075',      // 14px
    lineHeight: 'lineHeight075',  // 1.25
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',  // Medium
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Small button text for compact buttons and tertiary actions',
  description: 'Small button typography with 14px font size, 1.25 line height, body font family, medium weight'
},

'typography.buttonMd': {
  name: 'typography.buttonMd',
  primitiveReferences: {
    fontSize: 'fontSize100',      // 16px
    lineHeight: 'lineHeight100',  // 1.5
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Standard button text for primary and secondary buttons',
  description: 'Medium button typography with 16px font size, 1.5 line height, body font family, medium weight'
},

'typography.buttonLg': {
  name: 'typography.buttonLg',
  primitiveReferences: {
    fontSize: 'fontSize125',      // 18px
    lineHeight: 'lineHeight125',  // 1.75
    fontFamily: 'fontFamilyBody',
    fontWeight: 'fontWeight500',
    letterSpacing: 'letterSpacing100'
  },
  category: SemanticCategory.TYPOGRAPHY,
  context: 'Large button text for prominent CTAs and hero buttons',
  description: 'Large button typography with 18px font size, 1.75 line height, body font family, medium weight'
}
```

### Token Naming Migration Map

```typescript
// Migration map for renamed tokens
const TYPOGRAPHY_TOKEN_MIGRATION = {
  'typography.bodySmall': 'typography.bodySm',
  'typography.body': 'typography.bodyMd',
  'typography.bodyLarge': 'typography.bodyLg',
  'typography.button': 'typography.buttonMd'
};
```

---

## Data Models

### Primitive Token References

All typography tokens reference existing primitive tokens:

**Font Size Primitives** (from FontSizeTokens.ts):
- `fontSize050` = 13px (base ÷ 1.125²)
- `fontSize075` = 14px (base ÷ 1.125)
- `fontSize100` = 16px (base)
- `fontSize125` = 18px (base × 1.125)

**Line Height Primitives** (from LineHeightTokens.ts):
- `lineHeight050` = 1.0 (tight, for small text)
- `lineHeight075` = 1.25 (compact, for readable text)
- `lineHeight100` = 1.5 (optimal, for body text)
- `lineHeight125` = 1.75 (loose, for comfortable reading)

**Font Weight Primitives** (from FontWeightTokens.ts):
- `fontWeight400` = 400 (normal, for body text)
- `fontWeight500` = 500 (medium, for labels and buttons)

**Font Family Primitives** (from FontFamilyTokens.ts):
- `fontFamilyBody` = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
- `fontFamilyMono` = 'SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace'

**Letter Spacing Primitives** (from LetterSpacingTokens.ts):
- `letterSpacing100` = 0 (normal spacing)

### Cross-Platform Output

Typography tokens generate platform-specific output:

```typescript
// Web (CSS)
{
  fontSize: '1rem',           // fontSize100 → 1rem
  lineHeight: 1.5,            // lineHeight100 → unitless
  fontFamily: 'Inter, ...',   // fontFamilyBody → font stack
  fontWeight: 400,            // fontWeight400 → numeric
  letterSpacing: '0em'        // letterSpacing100 → em units
}

// iOS (SwiftUI)
{
  fontSize: 16,               // fontSize100 → pt
  lineHeight: 1.5,            // lineHeight100 → unitless
  fontFamily: 'Inter',        // fontFamilyBody → font name
  fontWeight: 400,            // fontWeight400 → numeric
  letterSpacing: 0            // letterSpacing100 → numeric
}

// Android (Compose)
{
  fontSize: 16,               // fontSize100 → sp
  lineHeight: 1.5,            // lineHeight100 → unitless
  fontFamily: 'Inter',        // fontFamilyBody → font name
  fontWeight: 400,            // fontWeight400 → numeric
  letterSpacing: 0            // letterSpacing100 → em
}
```

---

## Design Decisions

### Decision 1: Compositional Color Architecture

**Options Considered**:
1. **Include color in typography tokens** - Each typography token includes a color property
2. **Separate typography and color** - Typography defines structure, color applied separately (CHOSEN)
3. **Hybrid approach** - Default color in token, overridable at usage

**Decision**: Separate typography and color (compositional architecture)

**Rationale**:

Typography tokens define text **structure** (mathematical relationships between size, line-height, weight, family). Color defines text **appearance** (semantic meaning, mode-awareness). These are fundamentally different concerns that should be separated.

Including color in typography tokens would create combinatorial explosion:
- typography.bodyMd + color.text.default
- typography.bodyMd + color.text.muted
- typography.bodyMd + color.primary
- typography.bodyMd + color.error
- = 4 tokens just for bodyMd colors × 13 new typography tokens = 52 additional tokens

Compositional approach:
- 13 new typography tokens (structure)
- 15 existing color tokens (appearance)
- = Infinite combinations without token explosion

**Trade-offs**:
- ✅ **Gained**: Flexibility, fewer tokens, separation of concerns, easier theming
- ❌ **Lost**: Single-token convenience, need to apply color separately
- ⚠️ **Risk**: Developers might forget to apply color

**Counter-Arguments**:
- **Argument**: "Developers will forget to apply color and get unstyled text"
- **Response**: Platform defaults handle this (browsers, iOS, Android all have default text colors). Design system should provide helper functions that apply sensible defaults. Documentation and examples guide proper usage.

- **Argument**: "Other design systems include color in text styles (Figma, Sketch)"
- **Response**: Design tools are different from code systems. Figma text styles include color because designers work visually. Code systems benefit from composition because developers work programmatically. All major code-based design systems (Material, Chakra, Tailwind) use compositional approach.

### Decision 2: Label Xs Variant (Strategic Flexibility)

**Options Considered**:
1. **Add Xs to all families** - bodySm/bodyXs, labelSm/labelXs, codeSm/codeXs, buttonSm/buttonXs
2. **Add Xs only to labels** - labelXs for floating labels, no Xs for other families (CHOSEN)
3. **No Xs variants** - Use existing caption/legal tokens for 13px text

**Decision**: Add Xs only to labels (strategic flexibility)

**Rationale**:

Labels have a unique UI requirement that other typography families don't: **floating label patterns**. When a form input is focused, the label animates from placeholder position to above the input field, requiring smaller text (13px).

Other families don't have clear use cases for Xs variants:
- **Body text at 13px**: Already covered by typography.caption (light weight) and typography.legal (normal weight)
- **Code text at 13px**: Too small for monospace fonts, readability suffers below 14px
- **Button text at 13px**: Violates accessibility guidelines (WCAG recommends minimum 14px for interactive elements)

This is **strategic flexibility** - intentional asymmetry justified by real-world constraints, not perfect symmetry for its own sake.

**Trade-offs**:
- ✅ **Gained**: Solves floating label use case, minimal token growth, focused on real needs
- ❌ **Lost**: Perfect symmetry across families, predictability of "all families have same sizes"
- ⚠️ **Risk**: Developers might expect bodyXs/codeXs/buttonXs and be confused they don't exist

**Counter-Arguments**:
- **Argument**: "Inconsistent size scales across families is confusing"
- **Response**: Consistency for its own sake isn't valuable. The size scale should match real-world needs. Labels need Xs for floating patterns. Body/code/button don't have equivalent use cases. Documentation explains the rationale.

- **Argument**: "What if we need bodyXs later for fine print?"
- **Response**: We already have typography.caption and typography.legal at 13px. If a new use case emerges that neither covers, we can add bodyXs then. Process-first approach: prove the need before building.

### Decision 3: No Emphasis Typography Tokens

**Options Considered**:
1. **Create emphasis tokens** - typography.bodyMdBold, typography.bodyMdItalic, etc.
2. **Use platform modifiers** - Semantic HTML, SwiftUI modifiers, Compose spans (CHOSEN)
3. **Provide weight modifier tokens** - Separate fontWeight tokens for inline styling

**Decision**: Use platform-native modifiers for inline emphasis

**Rationale**:

Inline emphasis (bold, italic) is **contextual styling** within text, not **structural typography**. Every major design system (Material, Apple HIG, Chakra, Tailwind, Polaris) uses platform-native modifiers for emphasis rather than creating emphasis tokens.

Platform-native approaches:
- **Web**: Semantic HTML (`<strong>`, `<em>`) with accessibility benefits
- **iOS**: SwiftUI modifiers (`.fontWeight(.bold)`, `.italic()`)
- **Android**: Compose AnnotatedString with SpanStyle

Creating emphasis tokens would:
- Encourage non-semantic markup (`<span style={typography.strong}>` instead of `<strong>`)
- Harm accessibility (screen readers rely on semantic HTML)
- Create token explosion (bodyMdBold, bodyMdItalic, bodyMdBoldItalic × all sizes)
- Violate compositional architecture (emphasis is modifier, not base style)

**Trade-offs**:
- ✅ **Gained**: Semantic markup, accessibility, platform conventions, fewer tokens
- ❌ **Lost**: Single-token convenience for emphasis
- ⚠️ **Risk**: Developers might use primitive fontWeight tokens directly

**Counter-Arguments**:
- **Argument**: "Platform modifiers are inconsistent (HTML vs SwiftUI vs Compose)"
- **Response**: Each platform has its own conventions that developers expect. Trying to unify them with tokens would create an abstraction that fights platform idioms. Better to document platform-appropriate patterns.

- **Argument**: "Developers might use fontWeight700 directly instead of platform modifiers"
- **Response**: Documentation should discourage this and explain why platform modifiers are preferred. Linting rules can catch direct primitive usage. The design system provides guidance, not enforcement.

### Decision 4: Button Text Uses Medium Weight (500)

**Options Considered**:
1. **Normal weight (400)** - Same as body text
2. **Medium weight (500)** - Slightly heavier for emphasis (CHOSEN)
3. **Semibold weight (600)** - More prominent emphasis
4. **Bold weight (700)** - Maximum emphasis

**Decision**: Medium weight (500) for button text

**Rationale**:

Button text needs to be **slightly more prominent** than body text to indicate interactivity, but not so heavy that it overwhelms the UI. Medium weight (500) provides subtle emphasis without being aggressive.

Industry standards:
- **Material Design 3**: Uses 500 (medium) for button text
- **Apple HIG**: Uses 500-600 (medium to semibold) depending on context
- **Existing DesignerPunk**: typography.button already uses fontWeight500

This maintains consistency with existing system and aligns with industry standards.

**Trade-offs**:
- ✅ **Gained**: Subtle emphasis, consistency with existing system, industry alignment
- ❌ **Lost**: Maximum prominence (would need 600 or 700)
- ⚠️ **Risk**: Might not be prominent enough for some button hierarchies

**Counter-Arguments**:
- **Argument**: "Primary buttons should use bold (700) for maximum prominence"
- **Response**: Prominence comes from color, size, and spacing, not just weight. Primary buttons use color.primary and larger size (buttonLg). Adding bold weight would be too heavy. If needed, developers can override with platform modifiers.

- **Argument**: "500 is too subtle, buttons won't look interactive"
- **Response**: Interactivity is communicated through multiple cues: color, borders, shadows, hover states, cursor changes. Weight is just one factor. 500 provides enough distinction from body text (400) without being aggressive.

### Decision 5: Code Text Uses Normal Weight (400)

**Options Considered**:
1. **Light weight (300)** - Subtle, less prominent
2. **Normal weight (400)** - Standard readability (CHOSEN)
3. **Medium weight (500)** - Slightly heavier for emphasis

**Decision**: Normal weight (400) for code text

**Rationale**:

Code text prioritizes **readability** over emphasis. Monospace fonts are already visually distinct from body text, so additional weight isn't needed. Normal weight (400) provides optimal readability for code.

Industry standards:
- **VS Code**: Uses normal weight for code
- **GitHub**: Uses normal weight for code blocks
- **Most code editors**: Default to normal weight

Monospace fonts at heavier weights can become difficult to read, especially at smaller sizes.

**Trade-offs**:
- ✅ **Gained**: Optimal readability, industry alignment, visual distinction from labels/buttons
- ❌ **Lost**: Emphasis through weight
- ⚠️ **Risk**: Code might not stand out enough in some contexts

**Counter-Arguments**:
- **Argument**: "Code should use medium weight (500) to match labels for consistency"
- **Response**: Code and labels serve different purposes. Labels need emphasis (medium weight) to indicate UI elements. Code needs readability (normal weight) for technical content. Consistency for its own sake isn't valuable when use cases differ.

- **Argument**: "Inline code should be more prominent to stand out in paragraphs"
- **Response**: Prominence comes from monospace font family and background color (typically color.surface), not weight. Adding weight would reduce readability.

---

## Error Handling

### Invalid Primitive References

**Scenario**: Typography token references a primitive token that doesn't exist

**Handling**:
- Validation during token generation should verify all primitive references exist
- Throw descriptive error: "Typography token 'typography.bodySm' references invalid primitive 'fontSize999'"
- Provide suggestion: "Valid fontSize primitives: fontSize050, fontSize075, fontSize100, fontSize125"

### Missing Required Properties

**Scenario**: Typography token missing required primitive reference (fontSize, lineHeight, etc.)

**Handling**:
- TypeScript type system enforces all required properties at compile time
- Runtime validation should verify all properties present
- Throw descriptive error: "Typography token 'typography.bodySm' missing required property 'lineHeight'"

### Platform Generation Failures

**Scenario**: Platform-specific generation fails (invalid unit conversion, missing font family)

**Handling**:
- Catch generation errors and provide context
- Log warning with token name and platform: "Failed to generate typography.bodySm for iOS: Invalid font family"
- Fall back to base values where possible
- Document platform-specific requirements

---

## Testing Strategy

### Unit Testing

**Token Definition Validation**:
- Verify all typography tokens have required properties
- Verify all primitive references exist
- Verify naming follows conventions (bodySm, bodyMd, bodyLg pattern)
- Verify weight values are appropriate (400 for body/code, 500 for label/button)

**Primitive Reference Validation**:
- Verify fontSize references use modular scale tokens (050, 075, 100, 125)
- Verify lineHeight references pair correctly with fontSize (fontSize075 → lineHeight075)
- Verify fontFamily references use appropriate families (body vs mono)
- Verify fontWeight references use standard values (400, 500)

**Migration Map Validation**:
- Verify all renamed tokens have migration entries
- Verify migration map keys match old token names
- Verify migration map values match new token names

### Integration Testing

**Cross-Platform Generation**:
- Generate typography tokens for web, iOS, Android
- Verify fontSize units correct for each platform (rem, pt, sp)
- Verify lineHeight remains unitless across platforms
- Verify fontWeight remains numeric across platforms
- Verify fontFamily uses platform-appropriate stacks

**Token Composition**:
- Test composing typography tokens with color tokens
- Verify no color properties in typography token output
- Verify color can be applied separately without conflicts

**Mathematical Relationships**:
- Verify fontSize and lineHeight maintain vertical rhythm
- Verify modular scale relationships preserved (14px → 16px → 18px)
- Verify weight relationships consistent (400 for reading, 500 for UI)

### Documentation Testing

**Migration Documentation**:
- Verify migration guide includes all renamed tokens
- Verify examples show old and new token names
- Verify migration guide includes search-and-replace patterns

**Compositional Color Documentation**:
- Verify examples show typography + color composition for all platforms
- Verify recommended color pairings documented
- Verify rationale for compositional architecture explained

**Inline Emphasis Documentation**:
- Verify platform-specific emphasis patterns documented
- Verify examples for web (HTML), iOS (SwiftUI), Android (Compose)
- Verify guidance discourages direct primitive token usage

---

## Integration Points

### Existing Typography Tokens

**Unchanged tokens** (no modifications needed):
- typography.h1 through typography.h6 (heading hierarchy)
- typography.caption (13px, weight 300, image captions)
- typography.legal (13px, weight 400, fine print)
- typography.display (42px, weight 700, hero text)
- typography.input (16px, weight 400, form inputs)

**Renamed tokens** (require migration):
- typography.bodySmall → typography.bodySm
- typography.body → typography.bodyMd
- typography.bodyLarge → typography.bodyLg
- typography.button → typography.buttonMd

### Color Token Integration

Typography tokens compose with existing color tokens:

**Recommended pairings**:
- Body text: typography.bodyMd + color.text.default
- Secondary text: typography.bodySm + color.text.muted
- Labels: typography.labelMd + color.text.default
- Code: typography.codeMd + color.text.muted + color.surface (background)
- Buttons: typography.buttonMd + color.primary (or button-specific colors)

### Platform Generation System

Typography tokens integrate with existing cross-platform generation:
- Web: CSS custom properties or JavaScript objects
- iOS: Swift constants or SwiftUI extensions
- Android: Kotlin constants or Compose theme extensions

No changes to generation system required - new tokens follow existing patterns.

---

## Documentation Requirements

### Migration Guide

**Required content**:
1. Table showing old names → new names
2. Search-and-replace patterns for each platform
3. Rationale for naming changes (consistency with size scale)
4. Timeline for deprecation (if applicable)

### Compositional Color Guide

**Required content**:
1. Explanation of compositional architecture
2. Examples for each platform (web, iOS, Android)
3. Recommended color pairings for each typography family
4. Rationale for separating typography and color

### Inline Emphasis Guide

**Required content**:
1. Platform-specific emphasis patterns
2. Examples for bold and italic in each platform
3. Guidance against direct primitive token usage
4. Accessibility considerations for semantic markup

### Strategic Flexibility Rationale

**Required content**:
1. Explanation of why labelXs exists
2. Explanation of why bodyXs/codeXs/buttonXs don't exist
3. Use cases for each decision
4. Guidance on when to add new size variants

---

## File Organization and Completion Documentation

### Modified Files

This spec modifies existing files rather than creating new token files:

**Primary file**:
- `src/tokens/semantic/TypographyTokens.ts` - Add new typography tokens and rename existing tokens

**No new token files created** - all changes are additions/modifications to existing semantic typography token file.

### Completion Documentation

Task completion documents will be created following the Development Workflow standards:

**Location**: `.kiro/specs/typography-token-expansion/completion/`

**Naming convention**:
- Parent tasks: `task-[N]-completion.md` (e.g., `task-1-completion.md`)
- Subtasks: `task-[N.M]-completion.md` (e.g., `task-1-1-completion.md`)

**Organization metadata** (required in all completion documents):
```markdown
**Date**: [Completion date]
**Task**: [Task number and name]
**Type**: [Setup | Implementation | Architecture]
**Organization**: spec-completion
**Scope**: typography-token-expansion
**Status**: Complete
```

**Completion documentation tiers** (based on task type):
- **Setup tasks**: Tier 1 - Minimal (artifacts, notes, validation)
- **Implementation tasks**: Tier 2 - Standard (artifacts, details, validation, requirements)
- **Architecture tasks**: Tier 3 - Comprehensive (artifacts, decisions, algorithm, validation, lessons, integration)

### Automatic File Organization

Per Development Workflow, completion documents will be automatically organized:

**Trigger**: Task status changes to "completed"
**Hook**: `.kiro/agent-hooks/organize-after-task.sh`
**Process**:
1. Kiro detects task completion event
2. Agent hook scans for files with organization metadata
3. Files with `**Organization**: spec-completion` moved to `.kiro/specs/typography-token-expansion/completion/`
4. Cross-references updated automatically
5. Changes committed automatically

**Human control**: User confirmation required before file organization occurs.

---

*This design maintains the mathematical foundation and compositional architecture of the DesignerPunk system while expanding typography tokens to cover real-world UI needs with strategic flexibility and cross-platform consistency.*
