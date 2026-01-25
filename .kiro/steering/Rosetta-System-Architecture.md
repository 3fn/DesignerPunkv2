---
inclusion: manual
---

# Rosetta System Architecture

**Date**: 2026-01-25
**Purpose**: High-level architecture guide for the Rosetta System token generation pipeline
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: token-development, component-development, pipeline-integration
**Last Reviewed**: 2026-01-25

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

## RGBA Color Pipeline

Color tokens use RGBA format at the primitive level, enabling native alpha channel support and direct mapping to platform-specific color APIs.

### RGBA Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RGBA COLOR PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   PRIMITIVE DEFINITION (Source of Truth)                                     │
│   └── src/tokens/ColorTokens.ts                                             │
│       └── Format: rgba(R, G, B, A) where R,G,B are 0-255, A is 0.0-1.0     │
│       └── Example: 'purple-300': 'rgba(176, 38, 255, 1)'                    │
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│                                                                              │
│   SEMANTIC INHERITANCE                                                       │
│   └── src/tokens/semantic/ColorSemanticTokens.ts                            │
│       └── References primitives: 'color.action.primary': 'purple-300'       │
│       └── Baked-in alpha: 'color.structure.border.subtle': 'rgba(...,0.48)'│
│                                                                              │
│                              │                                               │
│                              ▼                                               │
│                                                                              │
│   PLATFORM GENERATION                                                        │
│   └── src/providers/*FormatGenerator.ts                                     │
│       ├── Web: rgba(R, G, B, A) → CSS rgba() format                         │
│       ├── iOS: rgba(R, G, B, A) → UIColor(red:green:blue:alpha:)           │
│       └── Android: rgba(R, G, B, A) → Color.argb(A×255, R, G, B)           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Platform Output Formats

Each platform generator transforms RGBA values to native color formats:

| Platform | Input | Output Format | Example |
|----------|-------|---------------|---------|
| **Web** | `rgba(176, 38, 255, 1)` | CSS `rgba()` | `--purple-300: rgba(176, 38, 255, 1);` |
| **iOS** | `rgba(176, 38, 255, 1)` | `UIColor(red:green:blue:alpha:)` | `UIColor(red: 0.69, green: 0.15, blue: 1.00, alpha: 1.00)` |
| **Android** | `rgba(176, 38, 255, 1)` | `Color.argb()` | `Color.argb(255, 176, 38, 255)` |

### Conversion Rules

**Web (CSS)**:
- RGBA values pass through unchanged
- Format: `rgba(R, G, B, A)` where R,G,B are 0-255, A is 0.0-1.0

**iOS (Swift)**:
- RGB values normalized to 0.0-1.0 range (divide by 255)
- Alpha preserved as-is (already 0.0-1.0)
- Format: `UIColor(red: R/255, green: G/255, blue: B/255, alpha: A)`

**Android (Kotlin)**:
- Alpha converted from 0.0-1.0 to 0-255 range (multiply by 255)
- RGB values preserved as integers
- Format: `Color.argb(A×255, R, G, B)`

### Baked-In Alpha Values

Some semantic tokens have baked-in alpha values for specific use cases:

```typescript
// Example: Subtle border with 48% opacity
'color.structure.border.subtle': 'rgba(184, 182, 200, 0.48)'
```

**Platform Output**:
- **Web**: `--color-structure-border-subtle: rgba(184, 182, 200, 0.48);`
- **iOS**: `UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 0.48)`
- **Android**: `Color.argb(122, 184, 182, 200)` (122 = 0.48 × 255)

### Entry Points

- Primitive color definitions: `src/tokens/ColorTokens.ts`
- Semantic color tokens: `src/tokens/semantic/ColorSemanticTokens.ts`
- Web generator: `src/providers/WebFormatGenerator.ts`
- iOS generator: `src/providers/iOSFormatGenerator.ts`
- Android generator: `src/providers/AndroidFormatGenerator.ts`

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
│   ├── WebFormatGenerator: CSS custom properties (RGBA format)               │
│   ├── iOSFormatGenerator: Swift constants (UIColor format)                  │
│   ├── AndroidFormatGenerator: Kotlin constants (Color.argb format)          │
│   └── Location: src/providers/*FormatGenerator.ts                           │
│                                                                              │
│   Color Format Conversion                                                    │
│   ├── parseRgbaString(): Parse RGBA string to components                    │
│   ├── rgbaStringToUIColor(): Convert to iOS UIColor format                  │
│   ├── rgbaStringToColorArgb(): Convert to Android Color.argb format         │
│   └── formatColorValue(): Handle mode-aware color objects                   │
│                                                                              │
│   Utility Generators                                                         │
│   ├── BlendUtilityGenerator: Blend functions per platform                   │
│   └── Location: src/generators/BlendUtilityGenerator.ts                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points**:
- Generation orchestration: `src/generators/TokenFileGenerator.ts`
- Web generation: `src/providers/WebFormatGenerator.ts`
- iOS generation: `src/providers/iOSFormatGenerator.ts`
- Android generation: `src/providers/AndroidFormatGenerator.ts`

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

**Token Creation Governance**: Creating component tokens requires human approval. See [Token Governance Guide](./Token-Governance.md) for decision matrix and review requirements.

---

## Subsystem Entry Points Summary

| Subsystem | Primary Entry Point | Purpose |
|-----------|---------------------|---------|
| **Definition** | `src/tokens/` | Token source files |
| **Validation** | `src/integration/ValidationCoordinator.ts` | Validation orchestration |
| **Registry** | `src/registries/` | Token storage and queries |
| **Generation** | `src/generators/TokenFileGenerator.ts` | Platform output generation |
| **Platform Generators** | `src/providers/*FormatGenerator.ts` | Platform-specific formatting |
| **Output** | `dist/` | Generated platform files |
| **Component Tokens** | `src/build/tokens/defineComponentTokens.ts` | Component token authoring |
| **Color Tokens** | `src/tokens/ColorTokens.ts` | RGBA primitive definitions |

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
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "RGBA Color Pipeline" })
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Component Token Integration" })
get_section({ path: ".kiro/steering/Rosetta-System-Architecture.md", heading: "Subsystem Entry Points Summary" })

# For token creation governance and guides
get_section({ path: ".kiro/steering/Token-Governance.md", heading: "Token Creation Guides" })
```

---

*This document provides architectural overview and entry points. For mathematical foundations and governance, see rosetta-system-principles.md.*
