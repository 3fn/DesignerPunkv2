# Requirements Document: Component Token Generation Pipeline

**Date**: January 5, 2026
**Spec**: 037 - Component Token Generation Pipeline
**Status**: Requirements Phase
**Dependencies**: 
- Spec 035 (Button-Icon Component) - QA validation case
- Rosetta System principles - Token architecture foundation
- Primitive/Semantic token pipeline - Pattern to follow

---

## Introduction

This specification defines requirements for integrating component tokens into the Rosetta System generation pipeline. Component tokens are component-specific values that supplement primitive and semantic tokens when existing tokens are mathematically insufficient for design requirements.

Currently, component tokens (like `buttonIcon.tokens.ts`) exist but are not connected to the generation pipeline. Platform implementation files contain hard-coded values instead of consuming generated tokens. This creates token compliance violations, maintenance burden, and inconsistency risk.

The solution introduces a hybrid component token authoring system (`defineComponentTokens()`) that provides lightweight authoring while producing rich metadata for pipeline integration.

---

## Glossary

- **Component Token**: A token specific to a single component that supplements primitive/semantic tokens when existing tokens are insufficient
- **Primitive Token**: Foundation-level token with mathematical relationship to family base value (e.g., `space150`)
- **Semantic Token**: Purpose-driven token that references primitive tokens (e.g., `tapAreaRecommended`)
- **Token Family**: Category of related tokens sharing a base value (spacing, fontSize, radius, etc.)
- **defineComponentTokens()**: Helper function for defining component tokens with explicit metadata
- **ComponentTokenRegistry**: Global registry that collects component tokens from all components
- **Platform Output**: Generated files consumed by platform implementations (CSS, Swift, Kotlin)

---

## Requirements

### Requirement 1: Architecture Documentation

**User Story**: As an AI agent developer, I want high-level Rosetta System architecture documentation, so that I can understand how tokens flow through the pipeline and where component tokens fit.

#### Acceptance Criteria

1. WHEN an AI agent needs to understand the token pipeline THEN the system SHALL provide a `Rosetta-System-Architecture.md` steering document in the MCP
2. WHEN the architecture document is accessed THEN it SHALL show the complete token flow: Definition → Validation → Registry → Generation → Platform Output
3. WHEN the architecture document is accessed THEN it SHALL provide entry points to detailed documentation for each subsystem (validators, registries, generators)
4. WHEN the architecture document is accessed THEN it SHALL remain evergreen by avoiding specific token counts, names, or values
5. WHEN the architecture document is accessed THEN it SHALL complement (not replace) existing `rosetta-system-principles.md`

---

### Requirement 2: Component Token Authoring API

**User Story**: As a component developer, I want a lightweight API for defining component tokens, so that I can create tokens close to my component implementation without verbose boilerplate.

#### Acceptance Criteria

1. WHEN a developer defines component tokens THEN the system SHALL provide a `defineComponentTokens()` helper function
2. WHEN using `defineComponentTokens()` THEN the developer SHALL specify the component name and token family explicitly
3. WHEN defining a token THEN the developer SHALL provide either a reference to an existing primitive token OR a value that conforms to the family's value definition pattern
4. WHEN defining a token THEN the developer SHALL provide a reasoning string explaining why the token exists
5. WHEN `defineComponentTokens()` is called THEN it SHALL return usable token values for immediate consumption by the component
6. WHEN `defineComponentTokens()` is called THEN it SHALL register the tokens with the global ComponentTokenRegistry

---

### Requirement 3: Component Token Validation

**User Story**: As a token system maintainer, I want component tokens to be validated against the token system's mathematical principles, so that component tokens maintain consistency with the broader token architecture.

#### Acceptance Criteria

1. WHEN a component token references a primitive token THEN the validation SHALL pass
2. WHEN a component token provides a value without a primitive reference THEN the validation SHALL verify the value conforms to the family's value definition pattern
3. WHEN a component token provides a magic number (e.g., `14` instead of `SPACING_BASE_VALUE * 1.75`) THEN the validation SHALL fail with a descriptive error
4. WHEN a component token is missing a reasoning string THEN the validation SHALL fail with a descriptive error
5. WHEN a component token references a non-existent primitive token THEN the validation SHALL fail with a descriptive error
6. WHEN validation fails THEN the system SHALL provide actionable error messages explaining how to fix the issue

---

### Requirement 4: Global Component Token Registry

**User Story**: As an AI agent developer, I want a global registry of all component tokens, so that I can query what tokens exist across all components and detect naming conflicts.

#### Acceptance Criteria

1. WHEN the build process runs THEN the system SHALL collect all component tokens from `src/components/**/**.tokens.ts` files
2. WHEN tokens are collected THEN the system SHALL register them in a global ComponentTokenRegistry
3. WHEN querying the registry THEN the system SHALL support `getAll()` to retrieve all component tokens
4. WHEN querying the registry THEN the system SHALL support `getByComponent(componentName)` to retrieve tokens for a specific component
5. WHEN querying the registry THEN the system SHALL support `getByFamily(familyName)` to retrieve tokens by token family
6. WHEN two components define tokens with the same name THEN the system SHALL detect the conflict and report an error

---

### Requirement 5: Platform Output Generation

**User Story**: As a platform developer, I want component tokens to generate platform-specific output (aligning to primitive and semantic token generation), so that platform implementation files can consume tokens instead of hard-coded values.

#### Acceptance Criteria

1. WHEN component tokens are registered THEN the system SHALL generate Web CSS custom properties referencing primitive tokens (e.g., `--button-icon-inset-medium: var(--space-125)`)
2. WHEN component tokens are registered THEN the system SHALL generate iOS Swift constants referencing primitive tokens
3. WHEN component tokens are registered THEN the system SHALL generate Android Kotlin constants referencing primitive tokens
4. WHEN a component token references a primitive THEN the generated output SHALL maintain the token chain (reference, not inline value)
5. WHEN platform output is generated THEN it SHALL be placed in the `dist/` directory alongside primitive and semantic token output
6. WHEN platform output is generated THEN it SHALL follow the same naming conventions as primitive/semantic token output

---

### Requirement 6: Button-Icon Integration (QA Validation)

**User Story**: As a quality assurance validator, I want Button-Icon component to use the new component token system, so that we can validate the pipeline works end-to-end.

#### Acceptance Criteria

1. WHEN `buttonIcon.tokens.ts` is updated THEN it SHALL use the new `defineComponentTokens()` API
2. WHEN Button-Icon tokens are defined THEN they SHALL reference primitive spacing tokens (`space100`, `space125`, `space150`)
3. WHEN Button-Icon tokens are defined THEN each token SHALL include reasoning explaining its purpose
4. WHEN platform output is generated THEN Button-Icon platform files SHALL be updated to consume generated tokens
5. WHEN TokenCompliance tests run THEN Button-Icon component SHALL pass (no hard-coded spacing values in platform files)
6. WHEN the integration is complete THEN it SHALL serve as a documented pattern for future component token creation

---

### Requirement 7: Deprecation of Existing Infrastructure

**User Story**: As a codebase maintainer, I want the old component token infrastructure deprecated, so that developers use the new hybrid approach consistently.

#### Acceptance Criteria

1. WHEN the new system is implemented THEN `src/build/tokens/ComponentToken.ts` SHALL be marked as deprecated with a notice pointing to `defineComponentTokens()`
2. WHEN the new system is implemented THEN `src/build/tokens/ComponentTokenGenerator.ts` SHALL be marked as deprecated with a notice pointing to `defineComponentTokens()`
3. WHEN a developer imports from deprecated files THEN they SHALL see deprecation warnings in their IDE
4. WHEN documentation references the old approach THEN it SHALL be updated to reference the new approach

---

## Non-Functional Requirements

### NFR 1: Developer Experience

1. WHEN defining component tokens THEN the authoring experience SHALL require fewer than 5 lines per token
2. WHEN using the API THEN TypeScript SHALL provide full type safety and autocompletion
3. WHEN errors occur THEN error messages SHALL be actionable and specific

### NFR 2: AI Agent Optimization

1. WHEN AI agents query the architecture documentation THEN they SHALL find relevant information within 2 MCP queries
2. WHEN AI agents create component tokens THEN the pattern SHALL be learnable from a single example
3. WHEN AI agents need to understand the token system THEN the documentation SHALL provide clear entry points

### NFR 3: Build Performance

1. WHEN the build process runs THEN component token collection SHALL not significantly impact build time
2. WHEN tokens are validated THEN validation SHALL complete in under 1 second for typical component counts

