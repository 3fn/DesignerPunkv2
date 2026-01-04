---
inclusion: manual
---

# Primitive vs Semantic Usage Philosophy

**Date**: 2026-01-01
**Purpose**: Decision guidance for when to use primitive vs semantic components in the Stemma System
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, component-selection, architecture
**Last Reviewed**: 2026-01-01

---

## Overview

The Stemma System has a fundamentally different philosophy for primitive component usage compared to the Rosetta System's token usage. Understanding this distinction is critical for making appropriate component choices.

**Key Insight**: While primitive tokens are discouraged (always prefer semantic tokens), primitive components are LEGITIMATE for coverage gaps.

---

## The Two Philosophies: Tokens vs Components

### Token Usage Philosophy (Rosetta System)

**Primitives are DISCOURAGED**

In the token system, primitive tokens should be avoided whenever possible:

| Scenario | Recommendation | Rationale |
|----------|----------------|-----------|
| Semantic token exists | ✅ Use semantic token | Semantic tokens encode design intent |
| No semantic token exists | ⚠️ Use primitive with documentation | Document the gap, propose elevation |
| Pattern emerges (3+ uses) | 🔄 Elevate to semantic token | Reduce primitive usage over time |

**Why primitives are discouraged for tokens:**
- Primitive tokens lack semantic meaning (`blue500` vs `color.primary`)
- Using primitives bypasses design intent
- Primitive usage indicates a gap that should be filled
- Goal: Eliminate primitive token usage through semantic elevation

**Example - Token Anti-Pattern:**
```typescript
// ❌ DON'T - Using primitive token
background: blue500

// ✅ DO - Using semantic token
background: color.primary
```

### Component Usage Philosophy (Stemma System)

**Primitives are LEGITIMATE for coverage gaps**

In the component system, primitive components are expected and appropriate:

| Scenario | Recommendation | Rationale |
|----------|----------------|-----------|
| Semantic component exists | ✅ Use semantic component | Semantic components encode specialized behavior |
| No semantic component exists | ✅ Use primitive component | Legitimate coverage gap |
| Pattern emerges (common usage) | 🔄 Consider creating semantic | Reduce primitive usage over time |

**Why primitives are legitimate for components:**
- Primitive components provide foundational behaviors
- Coverage gaps are expected during development
- Primitives enable custom functionality
- Goal: Reduce (not eliminate) primitive usage through semantic creation

**Example - Component Legitimate Usage:**
```typescript
// ✅ OK - Using primitive when no semantic exists
<Input-Text-Base label="Custom Field" />

// ✅ BETTER - Using semantic when it exists
<Input-Text-Email label="Email Address" />
```

---

## Why the Philosophies Differ

### Tokens: Design Intent Encoding

Tokens encode **design decisions** that should be consistent across the system:
- `color.primary` means "the primary brand color" everywhere
- `blue500` is just a color value with no semantic meaning
- Using primitives loses the design intent

**Consequence**: Primitive token usage is a problem to be solved.

### Components: Behavioral Foundation

Components encode **behavioral patterns** that build upon each other:
- `Input-Text-Base` provides foundational text input behaviors
- `Input-Text-Email` extends with email-specific behaviors
- Using primitives provides the foundation when no semantic exists

**Consequence**: Primitive component usage is expected and appropriate.

---

## Decision Framework for Component Selection

### Step 1: Check for Semantic Component

**Question**: Does a semantic component exist for my use case?

```
Need: Email input field
├── Check: Does Input-Text-Email exist?
│   └── YES → Use Input-Text-Email ✅
│
Need: Custom validation input
├── Check: Does Input-Text-CustomValidation exist?
│   └── NO → Continue to Step 2...
```

### Step 2: Evaluate Primitive Usage

**Question**: Is primitive usage appropriate for this scenario?

| Scenario | Use Primitive? | Action |
|----------|---------------|--------|
| No semantic variant exists | ✅ Yes | Use primitive, document the gap |
| Building custom functionality | ✅ Yes | Primitive provides foundation |
| Prototyping new patterns | ✅ Yes | Validate before creating semantic |
| Semantic exists but doesn't fit | ⚠️ Maybe | Discuss with team first |

### Step 3: Document Coverage Gaps

**When using primitives, document the gap:**

```typescript
// Using Input-Text-Base for custom validation pattern
// TODO: If this pattern becomes common, consider creating
// Input-Text-CustomValidation semantic component
<Input-Text-Base 
  label="Custom Field"
  validation={customValidator}
/>
```

### Step 4: Monitor for Semantic Opportunities

**When patterns emerge (3+ similar usages):**
1. Document the common pattern
2. Propose semantic component creation
3. Define specialized behaviors to add
4. Create semantic component
5. Migrate primitive usages

---

## Complete Decision Flowchart

```
Need a component?
    │
    ├── Does semantic variant exist?
    │   │
    │   ├── YES → Use semantic variant ✅
    │   │         (Preferred choice)
    │   │
    │   └── NO → Continue...
    │
    ├── Is this a common pattern?
    │   │
    │   ├── YES → Consider creating semantic variant
    │   │         - Document the pattern
    │   │         - Propose to team
    │   │         - Use primitive until created
    │   │
    │   └── NO → Use primitive (legitimate) ✅
    │            - Document the coverage gap
    │            - Monitor for pattern emergence
    │
    └── Using primitive for coverage gap?
        │
        └── Document for future semantic creation
            - Add TODO comment
            - Track in component backlog
            - Review periodically
```

---

## Comparison Table: Tokens vs Components

| Aspect | Token Philosophy | Component Philosophy |
|--------|------------------|---------------------|
| **Primitive usage** | Discouraged | Legitimate |
| **When no semantic exists** | Use primitive with warning | Use primitive normally |
| **Goal** | Eliminate primitive usage | Reduce primitive usage |
| **Primitive indicates** | Gap to be filled urgently | Expected coverage gap |
| **Documentation** | Required (anti-pattern) | Recommended (tracking) |
| **Elevation trigger** | 3+ usages | Common pattern emergence |

---

## Examples by Scenario

### Scenario 1: Semantic Exists - Use It

**Token Example:**
```typescript
// ❌ DON'T
color: blue500

// ✅ DO
color: color.primary
```

**Component Example:**
```typescript
// ❌ DON'T (when semantic exists)
<Input-Text-Base type="email" />

// ✅ DO
<Input-Text-Email />
```

### Scenario 2: No Semantic - Different Approaches

**Token Example:**
```typescript
// ⚠️ OK but document the gap
color: purple300  // TODO: Evaluate for semantic token elevation
```

**Component Example:**
```typescript
// ✅ OK - Legitimate usage
<Input-Text-Base 
  label="Custom Field"
  // No semantic exists for this use case
/>
```

### Scenario 3: Pattern Emerges - Create Semantic

**Token Example:**
```typescript
// Before: Multiple components using purple300
// After: Create semantic token
color: color.accent  // New semantic token
```

**Component Example:**
```typescript
// Before: Multiple places using Input-Text-Base with phone formatting
// After: Create semantic component
<Input-Text-PhoneNumber />  // New semantic component
```

---

## When Primitive Usage is Expected

Primitive component usage is **expected and correct** in these scenarios:

### 1. Early Development Phase

During initial development, semantic variants don't exist yet:
```typescript
// Phase 1: Only primitive exists
<Input-Text-Base label="Email" type="email" />

// Phase 2: Semantic created
<Input-Text-Email label="Email" />
```

### 2. Custom Functionality

When building functionality not covered by semantic variants:
```typescript
// Custom validation not covered by any semantic
<Input-Text-Base 
  label="Custom ID"
  validation={customIdValidator}
/>
```

### 3. Prototyping New Patterns

When exploring new patterns before committing to semantic:
```typescript
// Prototyping - validate pattern before creating semantic
<Input-Text-Base 
  label="Experimental Field"
  experimentalBehavior={true}
/>
```

### 4. One-Off Use Cases

When the use case is truly unique and won't recur:
```typescript
// Unique admin-only field, won't become a pattern
<Input-Text-Base 
  label="Admin Override Code"
  adminOnly={true}
/>
```

---

## When to Create Semantic Components

Create a semantic component when:

| Trigger | Action |
|---------|--------|
| **3+ similar primitive usages** | Document pattern, propose semantic |
| **Specialized behaviors needed** | Define behaviors, create semantic |
| **Common user need identified** | Design semantic, implement |
| **Cross-platform consistency needed** | Create semantic with contracts |

### Semantic Creation Checklist

- [ ] Pattern documented with 3+ examples
- [ ] Specialized behaviors defined
- [ ] Behavioral contracts specified
- [ ] Inheritance from primitive confirmed
- [ ] Cross-platform implementation planned
- [ ] Human-AI checkpoint completed

---

## Anti-Patterns to Avoid

### ❌ Avoiding Primitives When No Semantic Exists

**Wrong:**
```typescript
// Don't avoid primitives when they're appropriate
// This leads to duplicated code or workarounds
```

**Right:**
```typescript
// Use primitive when no semantic exists
<Input-Text-Base label="Custom Field" />
```

### ❌ Creating Premature Semantics

**Wrong:**
```typescript
// Don't create semantic for one-off use case
<Input-Text-AdminOverrideCode />  // Only used once
```

**Right:**
```typescript
// Use primitive for one-off cases
<Input-Text-Base label="Admin Override Code" />
```

### ❌ Treating Component Primitives Like Token Primitives

**Wrong:**
```typescript
// Don't treat primitive components as anti-patterns
// They're legitimate for coverage gaps
```

**Right:**
```typescript
// Primitive components are expected and appropriate
<Input-Text-Base label="Field" />  // ✅ OK when no semantic exists
```

---

## Summary: The Key Distinction

| System | Primitive Philosophy | Reason |
|--------|---------------------|--------|
| **Rosetta (Tokens)** | Discouraged - indicates problem | Tokens encode design intent that should be semantic |
| **Stemma (Components)** | Legitimate - expected usage | Components provide behavioral foundation |

**Remember:**
- **Tokens**: Always prefer semantic, primitive usage is a gap to fill
- **Components**: Prefer semantic when available, primitive usage is legitimate for coverage gaps

---

## Related Documentation

- [Stemma System Principles](./stemma-system-principles.md) - Core component architecture principles
- [Component Development Guide](./Component-Development-Guide.md) - Token selection framework
- [Token Quick Reference](./Token-Quick-Reference.md) - Token documentation routing
- [Component Schema Format](./Component-Schema-Format.md) - Component definition structure

---

*This document clarifies the fundamental philosophical difference between token and component primitive usage, enabling developers and AI agents to make appropriate choices in each context.*
