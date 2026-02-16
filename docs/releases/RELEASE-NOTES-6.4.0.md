# Release Notes: v6.4.0

**Date**: February 16, 2026
**Type**: Minor Release (new components, new agent system, no breaking changes)
**Previous**: v6.3.0 (Input-Radio Component Family)

---

## Summary

Two major feature areas: the **Progress Indicator Component Family** (6 new cross-platform components with dedicated token system) and the **Custom Agent System** (3 specialized AI agents — Ada, Lina, Thurgood — with progressive resource loading and domain-scoped configurations). Also includes a Stemma validator bugfix.

---

## New Components: Progress Indicator Family

### Token System Foundation

10 semantic color tokens and 10 component tokens providing the visual foundation for all progress indicators.

- Semantic colors: current, pending, completed, error states (strong + subtle variants)
- Component tokens: base sizes (sm/md/lg), formula-based current sizes with +4px emphasis, gaps, connector thickness
- Formula-based tokens use `SPACING_BASE_VALUE × multiplier` for non-color visual differentiation (accessibility)
- Cross-platform translation: CSS custom properties (web), Swift constants (iOS), Kotlin constants (Android)

### Progress-Indicator-Node-Base (Primitive)

Visual indicator dot/icon for individual steps.

- 4 states: incomplete, current, completed, error
- 3 sizes: sm, md, lg with current emphasis (+4px)
- Content variants: dot, checkmark, icon
- Cross-platform: web custom element, SwiftUI, Jetpack Compose

### Progress-Indicator-Connector-Base (Primitive)

Line segment connecting adjacent nodes.

- Active/inactive states using `borderDefault` thickness token
- Renders between nodes to show progression flow
- Cross-platform: web, iOS, Android

### Progress-Indicator-Label-Base (Primitive)

Centered text label below nodes.

- Uses `typography.labelSm` token
- Optional helper text with ellipsis truncation
- Cross-platform: web, iOS, Android

### Progress-Pagination-Base (Semantic)

Simple pagination dots for carousels and multi-page flows.

- Composes Node-Base primitives
- Sliding window virtualization for up to 50 items
- Dev/production validation modes
- WCAG 2.1 AA accessible
- Cross-platform: web custom element, SwiftUI, Jetpack Compose

### Progress-Stepper-Base (Semantic)

Simple stepper with connectors for linear multi-step flows.

- Composes Node-Base and Connector-Base primitives
- State derivation priority: error > completed > current > incomplete
- Validation: max 8 steps, no sm size
- ARIA progressbar accessibility
- Cross-platform: web custom element, SwiftUI, Jetpack Compose

### Progress-Stepper-Detailed (Semantic)

Labeled stepper with icons for rich multi-step workflows.

- Composes Node-Base, Connector-Base, and Label-Base primitives
- Icon support with precedence logic (completed = checkmark always)
- State derivation with error/optional announcements
- ARIA list roles for accessibility
- Validation: steps ≤ 8, size ≠ sm, currentStep clamping, errorSteps filtering
- Cross-platform: web custom element, SwiftUI, Jetpack Compose

---

## New Feature: Custom Agent System

Three specialized Kiro custom agents with domain-scoped configurations, progressive resource loading via `skill://` protocol, and user-triggered validation hooks.

### Ada — Rosetta Token Specialist

- Domain: Token system (primitives, semantics, component tokens, generators, validators)
- Write scope: `src/tokens/**`, `src/validators/**`, `src/generators/**`
- Resources: 3 file:// (always loaded), 22 skill:// (on-demand), 3 knowledgeBase (indexed search)
- Hooks: Token Health Check, Token Compliance Scan, Token Coverage Report, Platform Parity Check
- Activation: `/agent swap` or `ctrl+shift+a`

### Lina — Stemma Component Specialist

- Domain: Component development (scaffolding, implementation, testing, documentation)
- Write scope: `src/components/**`
- Resources: 3 file:// (always loaded), 14 skill:// (on-demand), 1 knowledgeBase
- Hooks: Stemma Compliance Check, Component Token Audit, Component Scaffold Validation, Platform Parity Check
- Activation: `/agent swap` or `ctrl+shift+l`

### Thurgood — Test Governance & Spec Standards Specialist

- Domain: Test governance, audits, spec standards
- Write scope: `src/__tests__/**`, `.kiro/specs/**`, `docs/specs/**`
- Resources: file:// and skill:// resources, no knowledge base (analytical mission)
- Hooks: Test Suite Health Audit, Spec Quality Scan, Accessibility Test Coverage Audit
- Activation: `/agent swap` or `ctrl+shift+t`

### Agent Infrastructure

- 51 steering documents updated with `skill://`-compatible YAML frontmatter
- Progressive disclosure: metadata loads at startup, full content on demand
- Domain boundaries enforced: no write scope overlap between agents on core paths
- All agents share `.kiro/specs/**` and `docs/specs/**` for spec task execution

---

## Bugfix: Stemma Validators

- **StemmaPropertyAccessibilityValidator**: Fixed Set/Group container detection — orchestration components (Input-Radio-Set, etc.) now correctly classified as containers, not inputs
- **StemmaComponentNamingValidator**: Added missing 'patterns' component type to `validateComponentNames` summary counts
- **InputRadioSet.stemma.test**: Updated test expectation from 'input' to 'container' to match corrected classification

---

## Architecture

### Progress Indicator Family

Follows the primitive-semantic composition pattern:
- 3 primitives (Node-Base, Connector-Base, Label-Base) handle visual rendering
- 3 semantic variants (Pagination-Base, Stepper-Base, Stepper-Detailed) compose primitives with behavior
- State derivation uses pure functions with priority logic
- Accessibility delegated to semantic layer (primitives are presentational)

### Custom Agent System

Domain-scoped agent architecture:
- Each agent has a focused domain with non-overlapping write scopes
- Progressive resource loading reduces token usage while keeping docs discoverable
- User-triggered hooks provide on-demand validation without automatic execution
- Ballot measure model for documentation governance (agent proposes, human decides)

---

## Testing

- 319 test suites, 8,221 tests, 0 failures
- 87 progress token tests (formula correctness, compliance, cross-platform translation)
- 129 progress component tests (Stemma contracts, state derivation, composition, accessibility, validation)
- 32 platform parity tests (web/iOS/Android equivalence across all 6 progress components)
- Agent configurations validated (JSON structure, resource paths, write scoping, cross-agent boundaries)

---

## Documentation

- 6 component READMEs for Progress Indicator family
- `Component-Family-Progress.md` steering document (MCP-queryable)
- 3 agent configurations with system prompts
- 11 user-triggered hooks across 3 agents
- 51 steering docs updated with skill-compatible frontmatter

---

## Spec References

- Spec 048: Progress Indicator Family (7 tasks, all complete)
- Spec 060: Custom Agent System (Ada 4 tasks + Lina 5 tasks + Thurgood 5 tasks, all complete)

---

## Migration

No migration required. This release adds new components and agent configurations without modifying existing APIs.
