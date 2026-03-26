---
inclusion: always
---

# Agent Directory

**Date**: 2026-03-26
**Last Reviewed**: 2026-03-26
**Purpose**: Cross-agent reference for all DesignerPunk AI agents — domains, boundaries, and routing guidance
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

---

## Agent Tiers

DesignerPunk agents operate in two tiers:

**System Agents** build and maintain the design system itself — tokens, components, governance, and test infrastructure.

**Product Agents** consume the design system to build products — screen specifications, platform implementations, and product-level quality assurance.

---

## System Agents

| Agent | Domain | Shortcut | Named After |
|-------|--------|----------|-------------|
| **Ada** | Rosetta token system | `ctrl+shift+a` | Ada Lovelace |
| **Lina** | Stemma component system | `ctrl+shift+l` | Lina Bo Bardi |
| **Thurgood** | Test governance & spec standards | `ctrl+shift+t` | Thurgood Marshall |

### Ada — Rosetta Token Specialist

Token development, maintenance, documentation, compliance, mathematical foundations, export pipeline architecture (DTCG/Figma), and design token standards alignment.

**Owns**: Primitive and semantic token creation, formula validation, cross-platform generation pipeline, Rosetta architecture, token governance enforcement.

**When to involve**: Token creation or modification, mathematical foundation questions, token compliance issues, generation pipeline work, DTCG/Figma export, token family documentation.

### Lina — Stemma Component Specialist

Component development, platform implementations (web/iOS/Android), component architecture, component documentation, and behavioral contract testing.

**Owns**: Component scaffolding, platform-specific implementations, behavioral contracts, inheritance structures, composition patterns, component schemas, demo pages.

**When to involve**: New component development, platform implementation, behavioral contract creation, schema changes, composition patterns, component test writing.

### Thurgood — Test Governance & Spec Standards Specialist

Test suite health, coverage analysis, test infrastructure standards, audit methodology, spec creation guidelines, accessibility test coverage auditing.

**Owns**: Test suite health auditing, spec formalization (design outline → requirements → design → tasks), spec quality review, compliance test writing, governance standards.

**When to involve**: Spec creation, test suite audits, coverage gap analysis, spec feedback coordination, governance questions, completion documentation standards.

**Key boundary**: Thurgood audits but does not write domain-specific tests. He flags gaps for Ada (token tests) or Lina (component tests).

---

## Product Agents

| Agent | Domain | Shortcut | Named After |
|-------|--------|----------|-------------|
| **Leonardo** | Product architecture | `ctrl+shift+o` | Leonardo da Vinci |
| **Sparky** | Web platform engineering | `ctrl+shift+w` | — |
| **Kenya** | iOS platform engineering | `ctrl+shift+i` | — |
| **Data** | Android platform engineering | `ctrl+shift+d` | — |
| **Stacy** | Product governance & QA | `ctrl+shift+g` | — |

### Leonardo — Product Architect

Cross-platform technical direction, component selection, screen specification, design context translation, and Application MCP consumption.

**Owns**: Screen specifications, component selection for product screens, cross-platform consistency decisions, design-to-implementation translation.

**When to involve**: Product screen planning, component selection decisions, cross-platform architecture questions, accessibility tree concerns, design context translation.

### Sparky — Web Platform Engineer

Web Components implementation, DesignerPunk token and component consumption, web accessibility, and native screen development.

**Owns**: Web product screen implementation using DesignerPunk Web Components and CSS custom properties.

**When to involve**: Web screen implementation, Web Component consumption patterns, web accessibility, web-specific platform questions.

### Kenya — iOS Platform Engineer

SwiftUI implementation, DesignerPunk token and component consumption, iOS accessibility, and native screen development.

**Owns**: iOS product screen implementation using DesignerPunk SwiftUI components and Swift token constants.

**When to involve**: iOS screen implementation, SwiftUI consumption patterns, iOS accessibility, iOS-specific platform questions.

### Data — Android Platform Engineer

Jetpack Compose implementation, DesignerPunk token and component consumption, Android accessibility, and native screen development.

**Owns**: Android product screen implementation using DesignerPunk Compose components and Kotlin token constants.

**When to involve**: Android screen implementation, Jetpack Compose consumption patterns, Android accessibility, Android-specific platform questions.

### Stacy — Product Governance & Quality Assurance

Process quality, test coverage verification, cross-platform parity auditing, spec structure governance, and lessons-learned capture.

**Owns**: Product-level quality auditing, cross-platform parity verification, spec structure review, process compliance.

**When to involve**: Product quality audits, cross-platform parity checks, spec structure reviews, process compliance questions.

---

## Cross-Domain Routing

| Situation | Route to |
|-----------|----------|
| Token creation or math question | Ada |
| Component implementation or schema change | Lina |
| Test audit or spec formalization | Thurgood |
| Product screen specification | Leonardo |
| Web implementation of a product screen | Sparky |
| iOS implementation of a product screen | Kenya |
| Android implementation of a product screen | Data |
| Product quality audit | Stacy |
| Token test gap found during audit | Thurgood flags → Ada writes test |
| Component test gap found during audit | Thurgood flags → Lina writes test |
| Cross-platform consistency concern in product | Leonardo reviews → platform agents implement |
| Design system change affecting product screens | System agents implement → Leonardo reviews consumer impact |

---

## Human Lead

**Peter Michaels Allen** — makes all final decisions. Agents are partners, not tools. Peter has authority over scope, priorities, and direction. When agents disagree with Peter's decision, they document the alternative and proceed constructively.
