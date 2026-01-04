---
inclusion: manual
---

# Token Resolution Patterns

**Date**: 2025-12-19
**Last Reviewed**: 2025-12-19
**Purpose**: Strategic guidance on handling flexible token types with validation and type safety
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, token-system-development

## Overview

DesignerPunk's token system includes both **fixed token types** (small, stable sets of values) and **flexible token types** (large, evolving sets of values). This document provides strategic guidance on:

- When to use fixed vs flexible token types
- How to validate token references
- How to maintain type safety
- What tooling can help prevent errors

**Key Principle**: The right token type depends on the size and stability of the value set, not just developer preference.

---

## Token Type Selection

### Fixed Token Types (Use TypeScript Enums/Unions)

**Use fixed token types when:**

- **Small, stable set of values**
  - Example: Padding tokens (`'100' | '200' | '300' | 'none'`)
  
- **Values unlikely to change frequently**
  - Example: Border radius tokens (`'none' | 'small' | 'normal' | 'large'`)
  
- **Component API benefits from limited choices**
  - Example: Layering tokens (`'base' | 'raised' | 'overlay'`)
  
- **Autocomplete and type safety are critical**
  - Example: Variant attributes (`'primary' | 'secondary' | 'danger'`)

**Benefits**:
- ✅ Compile-time validation (TypeScript catches typos)
- ✅ IDE autocomplete (developers see available options)
- ✅ Self-documenting (type definition shows all values)
- ✅ Refactoring safety (rename operations work correctly)

**Trade-offs**:
- ❌ Requires code changes when adding new values
- ❌ Can become unwieldy with large value sets
- ❌ Less flexible for design system evolution

**Examples in DesignerPunk**:
```typescript
// Fixed token types
type PaddingValue = '100' | '200' | '300' | 'none';
type BorderRadiusValue = 'none' | 'small' | 'normal' | 'large';
type LayeringValue = 'base' | 'raised' | 'overlay';
```


### Flexible Token Types (Use String Types with Validation)

**Use flexible token types when:**

- **Large set of values**
  - Example: Color tokens (hundreds of semantic and primitive colors)
  
- **Values may expand as design system grows**
  - Example: Shadow tokens (new elevation levels added over time)
  
- **Component API needs flexibility**
  - Example: Opacity tokens (design system may add new opacity values)
  
- **Type generation is feasible**
  - Example: Auto-generate types from token system

**Benefits**:
- ✅ Flexible for design system evolution
- ✅ No code changes when adding new tokens
- ✅ Scales to large token sets
- ✅ Can be auto-generated from token system

**Trade-offs**:
- ❌ No compile-time validation without type generation
- ❌ Typos not caught by TypeScript
- ❌ Requires runtime validation or build-time checks
- ❌ Less self-documenting

**Examples in DesignerPunk**:
```typescript
// Flexible token types (currently using string)
type ColorTokenName = string;  // Should be generated: 'color.primary' | 'color.secondary' | ...
type ShadowTokenName = string;  // Should be generated: 'shadow.dusk' | 'shadow.sunrise' | ...
type OpacityTokenName = string; // Should be generated: 'opacity.subtle' | 'opacity.medium' | ...
```

---

## Current State vs Desired State

### Current Implementation

**Fixed token types** (working well):
```typescript
// Container component
type PaddingValue = '100' | '200' | '300' | 'none';
type BorderRadiusValue = 'none' | 'small' | 'normal' | 'large';
type LayeringValue = 'base' | 'raised' | 'overlay';
```

**Flexible token types** (needs improvement):
```typescript
// Container component
background?: string;  // ❌ No validation, any string accepted
shadow?: string;      // ❌ No validation, any string accepted
opacity?: string;     // ❌ No validation, any string accepted
```

### Desired State (Future Enhancement)

**Auto-generated types for flexible tokens**:
```typescript
// Generated from token system
type ColorTokenName = 
  | 'color.primary'
  | 'color.secondary'
  | 'color.success'
  | 'color.error'
  // ... all color tokens

type ShadowTokenName =
  | 'shadow.dusk'
  | 'shadow.sunrise'
  | 'shadow.afternoon'
  // ... all shadow tokens

// Component uses generated types
interface ContainerProps {
  background?: ColorTokenName;  // ✅ Type-safe, autocomplete works
  shadow?: ShadowTokenName;     // ✅ Type-safe, autocomplete works
}
```

**Why this is better**:
- Compile-time validation catches typos
- IDE autocomplete shows available tokens
- Refactoring tools work correctly
- Self-documenting (type shows all options)

---

## Validation Strategies

### Type Generation (Recommended for Future)

**Auto-generate TypeScript types from token system**:

**Benefits**:
- Provides autocomplete and compile-time validation
- Types stay in sync with token system
- No manual maintenance required
- Works with existing TypeScript tooling

**Implementation approach** (out of scope for current spec):
```typescript
// scripts/generate-token-types.ts
// Reads token system, generates TypeScript types

// Generated output: src/tokens/generated-types.ts
export type ColorTokenName = 
  | 'color.primary'
  | 'color.secondary'
  // ... all color tokens from token system
```

**Usage in components**:
```typescript
import { ColorTokenName } from '@/tokens/generated-types';

interface ContainerProps {
  background?: ColorTokenName;  // Type-safe!
}
```

### Resolution Functions (Recommended for Future)

**Auto-generate token resolution functions**:

**Benefits**:
- Validates token names at runtime
- Provides fallback behavior for invalid tokens
- Centralizes token resolution logic
- Can log warnings for debugging

**Implementation approach** (out of scope for current spec):
```typescript
// scripts/generate-token-resolvers.ts
// Reads token system, generates resolution functions

// Generated output: src/tokens/generated-resolvers.ts
export function resolveColorToken(name: ColorTokenName): string {
  const tokens: Record<string, string> = {
    'color.primary': DesignTokens.color.primary,
    'color.secondary': DesignTokens.color.secondary,
    // ... all color tokens
  };
  
  if (!tokens[name]) {
    console.warn(`Invalid color token: ${name}`);
    return DesignTokens.color.primary; // fallback
  }
  
  return tokens[name];
}
```

**Usage in components**:
```typescript
import { resolveColorToken } from '@/tokens/generated-resolvers';

// Component implementation
const backgroundColor = resolveColorToken(this.background);
// ✅ Validates token name
// ✅ Provides fallback if invalid
// ✅ Logs warning for debugging
```

### Build-Time Validation (Recommended for Future)

**Fail build if components reference non-existent tokens**:

**Benefits**:
- Catches typos and invalid references early
- Prevents runtime errors
- Works with CI/CD pipelines
- No runtime performance cost

**Implementation approach** (out of scope for current spec):
```typescript
// scripts/validate-token-references.ts
// Scans component files for token references
// Validates against token system
// Fails build if invalid references found

// Example validation
const componentTokens = extractTokenReferences('src/components/');
const validTokens = loadTokenSystem();

const invalidTokens = componentTokens.filter(
  token => !validTokens.includes(token)
);

if (invalidTokens.length > 0) {
  console.error('Invalid token references found:');
  invalidTokens.forEach(token => console.error(`  - ${token}`));
  process.exit(1);
}
```

---

## Implementation Patterns

### Component API Design

**Fixed token types** (current pattern):
```typescript
// Use TypeScript union types for small, stable sets
interface ContainerProps {
  padding?: '100' | '200' | '300' | 'none';
  borderRadius?: 'none' | 'small' | 'normal' | 'large';
  layering?: 'base' | 'raised' | 'overlay';
}
```

**Flexible token types** (current pattern):
```typescript
// Use string type (no validation currently)
interface ContainerProps {
  background?: string;  // Should be ColorTokenName
  shadow?: string;      // Should be ShadowTokenName
  opacity?: string;     // Should be OpacityTokenName
}
```

**Flexible token types** (desired pattern with type generation):
```typescript
// Use generated types for large, evolving sets
import { ColorTokenName, ShadowTokenName, OpacityTokenName } from '@/tokens/generated-types';

interface ContainerProps {
  background?: ColorTokenName;  // ✅ Type-safe
  shadow?: ShadowTokenName;     // ✅ Type-safe
  opacity?: OpacityTokenName;   // ✅ Type-safe
}
```

### Token Resolution

**Current pattern** (no validation):
```typescript
// Component reads attribute directly
const background = this.getAttribute('background');
// ❌ No validation, any string accepted
// ❌ Typos not caught
// ❌ Invalid tokens cause runtime errors
```

**Desired pattern** (with resolution function):
```typescript
// Component uses resolution function
import { resolveColorToken } from '@/tokens/generated-resolvers';

const backgroundToken = this.getAttribute('background') as ColorTokenName;
const background = resolveColorToken(backgroundToken);
// ✅ Validates token name
// ✅ Provides fallback if invalid
// ✅ Logs warning for debugging
```

---

## Tooling Recommendations

**These enhancements are out of scope for the current spec** but represent the strategic direction for improving token resolution:

### 1. Generate TypeScript Types for Flexible Tokens

**Purpose**: Provide autocomplete and type safety for large token sets

**Implementation**:
- Script reads token system (JSON or TypeScript)
- Generates TypeScript union types for each token category
- Outputs to `src/tokens/generated-types.ts`
- Runs as part of build process

**Benefits**:
- Compile-time validation
- IDE autocomplete
- Refactoring safety
- Self-documenting

### 2. Generate Token Resolution Functions

**Purpose**: Validate token references at runtime with fallback behavior

**Implementation**:
- Script reads token system
- Generates resolution functions for each token category
- Outputs to `src/tokens/generated-resolvers.ts`
- Includes validation and fallback logic

**Benefits**:
- Runtime validation
- Graceful fallback behavior
- Centralized resolution logic
- Debug logging

### 3. Add Build-Time Validation

**Purpose**: Fail build if components reference non-existent tokens

**Implementation**:
- Script scans component files for token references
- Validates against token system
- Fails build if invalid references found
- Integrates with CI/CD pipeline

**Benefits**:
- Early error detection
- Prevents runtime errors
- Works with existing tooling
- No runtime performance cost

### 4. Add TypeScript Guards Against Placeholders

**Purpose**: Prevent placeholder implementations from compiling

**Implementation**:
- Use TypeScript's type system to mark placeholder functions
- Compiler error if placeholder used in production code
- Forces completion of token resolution

**Benefits**:
- Compile-time enforcement
- Prevents incomplete implementations
- Clear error messages
- No runtime cost

---

## When to Pause and Ask

**Pause and ask Peter when:**

- **Unclear whether to use fixed or flexible token type**
  - "Component needs [token category]. Should I use fixed enum or flexible string type?"
  
- **Token resolution pattern doesn't exist for your use case**
  - "Component needs to resolve [token type] but no resolution function exists. Should I create one or use direct reference?"
  
- **Need to create new token type category**
  - "Component needs [new token category]. Should I create fixed or flexible type?"
  
- **Validation strategy unclear**
  - "How should I validate [token type] references in this component?"

---

## Examples and Patterns

### Example 1: Container Component (Current Implementation)

**Fixed token types** (working well):
```typescript
interface ContainerProps {
  padding?: '100' | '200' | '300' | 'none';
  borderRadius?: 'none' | 'small' | 'normal' | 'large';
  layering?: 'base' | 'raised' | 'overlay';
}
```

**Flexible token types** (needs improvement):
```typescript
interface ContainerProps {
  background?: string;  // Should be ColorTokenName
  shadow?: string;      // Should be ShadowTokenName
}
```

**Why this works**:
- Padding, borderRadius, layering are small, stable sets → fixed types
- Background, shadow are large, evolving sets → flexible types (but need type generation)

### Example 2: Button Component (Hypothetical)

**Fixed token types**:
```typescript
interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'danger';
}
```

**Flexible token types** (with type generation):
```typescript
import { ColorTokenName, TypographyTokenName } from '@/tokens/generated-types';

interface ButtonProps {
  color?: ColorTokenName;        // Large set, needs flexibility
  typography?: TypographyTokenName;  // Large set, needs flexibility
}
```

**Why this works**:
- Size, variant are component-specific, small sets → fixed types
- Color, typography are design system tokens, large sets → flexible types with generation

### Example 3: Icon Component (Current Implementation)

**Fixed token types**:
```typescript
interface IconProps {
  size?: '12' | '16' | '24' | '32' | '40';  // Icon size tokens
}
```

**Flexible token types**:
```typescript
interface IconProps {
  color?: string;  // Should be ColorTokenName
}
```

**Why this works**:
- Size is small, stable set (5 values) → fixed type
- Color is large, evolving set (hundreds of values) → flexible type (needs generation)

---

## Migration Path

**For existing components using flexible token types without validation:**

### Phase 1: Document Current State (Immediate)

- Add comments noting which props should use generated types
- Document validation strategy in component README
- Flag for future enhancement

```typescript
interface ContainerProps {
  // TODO: Use ColorTokenName when type generation available
  background?: string;
  
  // TODO: Use ShadowTokenName when type generation available
  shadow?: string;
}
```

### Phase 2: Generate Types (Future Spec)

- Create type generation script
- Generate types for color, shadow, opacity tokens
- Update component interfaces to use generated types

### Phase 3: Add Resolution Functions (Future Spec)

- Create resolution function generator
- Generate resolvers for each token category
- Update components to use resolvers

### Phase 4: Add Build-Time Validation (Future Spec)

- Create validation script
- Integrate with build process
- Fail build on invalid token references

---

## Related Documentation

- [Component Development and Practices Guide](./Component Development and Practices Guide.md) - Component implementation guidance with token selection framework
- [Cross-Platform vs Platform-Specific Decision Framework](./Cross-Platform vs Platform-Specific Decision Framework.md) - Strategic guidance on cross-platform vs platform-specific decisions
- [Token System Overview](../../docs/token-system-overview.md) - Complete token system documentation

---

*This framework provides strategic guidance for token type selection and validation. Tooling enhancements are out of scope for the current spec but represent the strategic direction for improving token resolution.*
