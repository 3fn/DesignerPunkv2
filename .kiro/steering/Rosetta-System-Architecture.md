---
inclusion: manual
---

# Rosetta System Architecture

**Date**: 2026-01-05
**Purpose**: High-level architecture guide for the Rosetta System token generation pipeline
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: token-development, component-development, pipeline-integration
**Last Reviewed**: 2026-01-05

---

## Overview

This document provides a high-level architectural overview of the Rosetta System token generation pipeline. It serves as an entry point for AI agents and developers who need to understand how tokens flow from definition to platform output.

**Relationship to Other Documents**:
- **rosetta-system-principles.md**: Mathematical foundations, naming conventions, governance (the "what" and "why")
- **This document**: Pipeline architecture, subsystem entry points, integration patterns (the "how")

**When to Use This Document**:
- Understanding how tokens flow through the system
- Finding entry points to specific subsystems (validators, registries, generators)
- Understanding where component tokens fit in the pipeline
- Debugging token generation issues

---

## Token Consumption Rule

**Tokens are pre-unitized. Never add platform units when consuming tokens.**

The token generators apply platform-appropriate units during build:
- **Web**: `rem`, `px` (CSS custom properties)
- **iOS**: `CGFloat` (points, implicit)
- **Android**: `Dp` (density-independent pixels)

| Platform | ✅ Correct | ❌ Wrong |
|----------|-----------|----------|
| Android | `DesignTokens.space_200` | `DesignTokens.space_200.dp` |
| Android | `ButtonIconTokens.insetSmall` | `ButtonIconTokens.insetSmall.dp` |
| iOS | `DesignTokens.space200` | `DesignTokens.space200.pt` |
| Web | `var(--space-200)` | `var(--space-200)px` |

This applies to **all token types**: primitive, semantic, and component tokens.

**Why?** The unitless architecture enables:
- Single source of truth for values
- Platform generators handle unit conversion
- Prevents double-unit bugs (e.g., `16.dp.dp`)
- Consistent consumption pattern across all platforms

---

## Token Pipeline Architecture

The Rosetta System processes tokens through a five-stage pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TOKEN PIPELINE FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│   │  DEFINITION  │───▶│  VALIDATION  │───▶│   REGISTRY   │                  │
│   │              │    │              │    │              │                  │
│   │ Token files  │    │ Mathematical │    │ Global store │                  │
│   │ define raw   │    │ relationships│    │ for queries  │                  │
│   │ values       │    │ verified     │    │ and lookups  │                  │
│   └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                  │                           │
│                                                  ▼                           │
│                       ┌──────────────┐    ┌──────────────┐                  │
│                       │   PLATFORM   │◀───│  GENERATION  │                  │
│                       │    OUTPUT    │    │              │                  │
│                       │              │    │ Transform to │                  │
│                       │ CSS, Swift,  │    │ platform     │                  │
│                       │ Kotlin files │    │ formats      │                  │
│                       └──────────────┘    └──────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stage 1: Definition

Tokens are defined in TypeScript files with mathematical relationships and metadata.

**Token Layers**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOKEN DEFINITION LAYERS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Layer 1: PRIMITIVE TOKENS                                                  │
│   ├── Mathematical foundation (base values × multipliers)                   │
│   ├── Location: src/tokens/*.ts                                             │
│   └── Examples: spacing, color, typography, radius                          │
│                                                                              │
│   Layer 2: SEMANTIC TOKENS                                                   │
│   ├── Purpose-driven compositions referencing primitives                    │
│   ├── Location: src/tokens/semantic/*.ts                                    │
│   └── Examples: space.inset.*, color.primary, bodyMd                        │
│                                                                              │
│   Layer 3: COMPONENT TOKENS                                                  │
│   ├── Component-specific values referencing primitives                      │
│   ├── Location: src/components/*/tokens.ts                                  │
│   └── Examples: buttonIcon.inset.*, textInput.padding.*                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Primitive tokens: `src/tokens/` directory
- Semantic tokens: `src/tokens/semantic/` directory
- Component tokens: `src/components/*/tokens.ts` files

### Stage 2: Validation

Tokens are validated against mathematical principles and naming conventions.

**Validation Architecture**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VALIDATION SUBSYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ValidationCoordinator (Orchestrator)                                       │
│   ├── Coordinates all validation activities                                 │
│   ├── Caches validation results for performance                             │
│   └── Location: src/integration/ValidationCoordinator.ts                    │
│                                                                              │
│   ThreeTierValidator (Pass/Warning/Error)                                    │
│   ├── Validates mathematical relationships                                  │
│   ├── Enforces tolerance thresholds (≤5% pass, 5-25% warning, >25% error)  │
│   └── Location: src/validators/ThreeTierValidator.ts                        │
│                                                                              │
│   MathematicalRelationshipParser                                             │
│   ├── Parses and validates mathematical formulas                            │
│   └── Location: src/validators/MathematicalRelationshipParser.ts            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Validation orchestration: `src/integration/ValidationCoordinator.ts`
- Three-tier validation: `src/validators/ThreeTierValidator.ts`
- Mathematical parsing: `src/validators/MathematicalRelationshipParser.ts`

### Stage 3: Registry

Validated tokens are stored in global registries for querying and lookup.

**Registry Architecture**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          REGISTRY SUBSYSTEM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   IRegistry<T> (Interface)                                                   │
│   ├── Standard interface for all registries                                 │
│   ├── Methods: register(), get(), getAll(), has(), clear()                  │
│   └── Location: src/registries/IRegistry.ts                                 │
│                                                                              │
│   PrimitiveTokenRegistry                                                     │
│   ├── Stores primitive tokens                                               │
│   ├── Supports getByFamily() for family-based queries                       │
│   └── Location: src/registries/PrimitiveTokenRegistry.ts                    │
│                                                                              │
│   SemanticTokenRegistry                                                      │
│   ├── Stores semantic tokens                                                │
│   ├── Tracks primitive references                                           │
│   └── Location: src/registries/SemanticTokenRegistry.ts                     │
│                                                                              │
│   ComponentTokenRegistry                                                     │
│   ├── Stores component tokens                                               │
│   ├── Supports getByComponent() and getByFamily() queries                   │
│   └── Location: src/registries/ComponentTokenRegistry.ts                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Registry interface: `src/registries/IRegistry.ts`
- Primitive registry: `src/registries/PrimitiveTokenRegistry.ts`
- Semantic registry: `src/registries/SemanticTokenRegistry.ts`
- Component registry: `src/registries/ComponentTokenRegistry.ts`

### Stage 4: Generation

Registered tokens are transformed into platform-specific formats.

**Generation Architecture**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENERATION SUBSYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   TokenFileGenerator (Orchestrator)                                          │
│   ├── Coordinates all generation activities                                 │
│   ├── Queries registries for tokens to generate                             │
│   └── Location: src/generators/TokenFileGenerator.ts                        │
│                                                                              │
│   Platform Format Generators                                                 │
│   ├── WebFormatGenerator: CSS custom properties                             │
│   ├── iOSFormatGenerator: Swift constants                                   │
│   ├── AndroidFormatGenerator: Kotlin constants                              │
│   └── Location: src/generators/*FormatGenerator.ts                          │
│                                                                              │
│   Utility Generators                                                         │
│   ├── BlendUtilityGenerator: Blend functions per platform                   │
│   └── Location: src/generators/BlendUtilityGenerator.ts                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Generation orchestration: `src/generators/TokenFileGenerator.ts`
- Web generation: `src/generators/WebFormatGenerator.ts`
- iOS generation: `src/generators/iOSFormatGenerator.ts`
- Android generation: `src/generators/AndroidFormatGenerator.ts`

### Stage 5: Platform Output

Generated files are written to the `dist/` directory for consumption.

**Output Structure**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PLATFORM OUTPUT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   dist/                                                                      │
│   ├── DesignTokens.web.css      (CSS custom properties)                     │
│   ├── DesignTokens.ios.swift    (Swift constants)                           │
│   ├── DesignTokens.android.kt   (Kotlin constants)                          │
│   ├── BlendUtilities.web.css    (Web blend functions)                       │
│   ├── BlendUtilities.ios.swift  (iOS blend functions)                       │
│   ├── BlendUtilities.android.kt (Android blend functions)                   │
│   ├── ComponentTokens.web.css   (Component token CSS)                       │
│   ├── ComponentTokens.ios.swift (Component token Swift)                     │
│   └── ComponentTokens.android.kt(Component token Kotlin)                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Output directory: `dist/`
- Build scripts: `scripts/` directory

---

## Component Token Integration

Component tokens represent a third layer in the token hierarchy, sitting between semantic tokens and platform implementations.

### Component Token Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPONENT TOKEN PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Component Token Definition                                                 │
│   └── src/components/[ComponentName]/tokens.ts                              │
│       └── defineComponentTokens({ component, family, tokens })              │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│                                                                              │
│   Component Token Registry                                                   │
│   └── Automatic registration via defineComponentTokens()                    │
│       └── Supports getByComponent(), getByFamily() queries                  │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│                                                                              │
│   Validation                                                                 │
│   └── ValidationCoordinator.validateComponentToken()                        │
│       ├── Reasoning requirement (non-empty string)                          │
│       ├── Primitive reference validation                                    │
│       └── Family-conformant value validation                                │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│                                                                              │
│   Platform Generation                                                        │
│   └── TokenFileGenerator.generateComponentTokens()                          │
│       ├── Web: --component-token-name: var(--primitive-reference)           │
│       ├── iOS: ComponentTokens.tokenName = PrimitiveTokens.reference        │
│       └── Android: ComponentTokens.tokenName = PrimitiveTokens.reference    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Token Authoring

Component tokens are defined using the `defineComponentTokens()` helper:

```typescript
// src/components/[ComponentName]/tokens.ts
import { defineComponentTokens } from '../../build/tokens/defineComponentTokens';
import { spacingTokens } from '../../tokens/SpacingTokens';

export const ComponentNameTokens = defineComponentTokens({
  component: 'ComponentName',
  family: 'spacing',
  tokens: {
    'inset.large': {
      reference: spacingTokens.space150,
      reasoning: 'Explanation of why this token exists',
    },
    // ... more tokens
  },
});
```

**Key Characteristics**:
- Explicit component and family association
- Required reasoning for each token
- References to primitive tokens (preferred) or family-conformant values
- Automatic registration with ComponentTokenRegistry

**Entry Points**:
- Helper function: `src/build/tokens/defineComponentTokens.ts`
- Component token registry: `src/registries/ComponentTokenRegistry.ts`

---

## Creating New Component Tokens (Migration Pattern)

When creating component tokens for a new component, follow this pattern:

### Step 1: Create Token File

Create `src/components/[ComponentName]/tokens.ts`:

```typescript
import { defineComponentTokens } from '../../build/tokens/defineComponentTokens';
import { spacingTokens } from '../../tokens/SpacingTokens';
// Import other token families as needed

export const ComponentNameTokens = defineComponentTokens({
  component: 'ComponentName',
  family: 'spacing', // or 'radius', 'fontSize', etc.
  tokens: {
    'tokenName': {
      reference: spacingTokens.space100, // Reference existing primitive
      reasoning: 'Clear explanation of why this token exists',
    },
  },
});
```

### Step 2: Token Definition Options

**Option A: Reference Primitive (Preferred)**
```typescript
'inset.large': {
  reference: spacingTokens.space150,
  reasoning: 'Large inset provides comfortable touch target padding',
}
```

**Option B: Family-Conformant Value**
```typescript
'custom.spacing': {
  value: 14, // Must conform to family's mathematical pattern
  reasoning: 'Custom value needed for specific design requirement',
}
```

### Step 3: Consume in Platform Files

**Web (CSS)**:
```css
.component {
  padding: var(--component-name-inset-large);
}
```

**iOS (Swift)**:
```swift
.padding(ComponentNameTokens.insetLarge)
```

**Android (Kotlin)**:
```kotlin
Modifier.padding(ComponentNameTokens.insetLarge)
```

### Validation Requirements

All component tokens must:
1. Include a non-empty `reasoning` string
2. Either reference an existing primitive OR provide a family-conformant value
3. Use the correct token family for the value type

### Deprecated Infrastructure

The following files are deprecated and should NOT be used for new component tokens:
- `src/build/tokens/ComponentToken.ts` - Use `defineComponentTokens()` instead
- `src/build/tokens/ComponentTokenGenerator.ts` - Use `defineComponentTokens()` instead

---

## Subsystem Entry Points Summary

| Subsystem | Primary Entry Point | Purpose |
|-----------|---------------------|---------|
| **Definition** | `src/tokens/` | Token source files |
| **Validation** | `src/integration/ValidationCoordinator.ts` | Validation orchestration |
| **Registry** | `src/registries/` | Token storage and queries |
| **Generation** | `src/generators/TokenFileGenerator.ts` | Platform output generation |
| **Output** | `dist/` | Generated platform files |
| **Component Tokens** | `src/build/tokens/defineComponentTokens.ts` | Component token authoring |

---

## Related Documentation

### Rosetta System
- [Rosetta System Principles](./rosetta-system-principles.md) - Mathematical foundations, naming conventions, governance
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation routing
- [Token Family Guides](./Token-Family-*.md) - Family-specific documentation

### Architecture
- [Token System Overview](../../docs/token-system-overview.md) - Master document mapping token files
- [Registry-Validator Pattern](../../docs/architecture/registry-validator-pattern.md) - Validation patterns

### Component Development
- [Component Development Guide](./Component-Development-Guide.md) - Token selection and component patterns
- [Stemma System Principles](./stemma-system-principles.md) - Component hierarchy and relationships

---

## MCP Query Examples

```
# Get this document
get_document_full({ path: ".kiro/steering/Rosetta-System-Architecture.md" })

# Get specific sections
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Token Pipeline Architecture" })
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Component Token Integration" })
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Creating New Component Tokens (Migration Pattern)" })
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Subsystem Entry Points Summary" })
```

---

*This document provides architectural overview and entry points. For mathematical foundations and governance, see rosetta-system-principles.md.*
