# Release Notes v5.0.0

**Release Date**: January 18, 2026
**Previous Version**: v4.2.0

---

## Overview

This major release introduces the **Avatar Component** — a new cross-platform component for representing users (Human) and AI agents (Agent) with distinct visual shapes. This release also includes significant infrastructure improvements to the AI Collaboration Framework and MCP Documentation Server.

**Why Major Version?** This release includes breaking changes to internal infrastructure and introduces new architectural patterns that may affect downstream integrations.

---

## New Features

### Avatar Component (Spec 042)

A new cross-platform component for representing users and AI agents with shape-based differentiation.

**Custom Element**: `<avatar-base>`

**Entity Types**:
| Type | Shape | Background | Use Case |
|------|-------|------------|----------|
| `human` | Circle | `orange300` | User profiles, human participants |
| `agent` | Hexagon (pointy-top, rounded corners) | `teal300` | AI agents, bots, automated systems |

**Six Size Variants**:
| Size | Dimensions | Icon Size | Use Case |
|------|------------|-----------|----------|
| `xs` | 24px | 12px | Inline mentions, dense lists |
| `sm` | 32px | 16px | List items, comments |
| `md` | 40px | 20px | Standard cards, messages |
| `lg` | 48px | 24px | Profile headers |
| `xl` | 80px | 40px | Profile pages |
| `xxl` | 128px | 64px | Hero sections |

**Key Features**:
- **Shape-based differentiation**: Circles for humans (organic), hexagons for AI (synthetic)
- **Image support**: Human avatars can display profile photos with fallback to icon
- **Interactive mode**: Hover visual feedback with border width transition
- **Accessibility**: Proper ARIA attributes, decorative mode for adjacent text
- **Token-first**: All sizing, colors, and borders use design tokens

**Cross-Platform Implementations**:
- **Web**: Web Component with Shadow DOM, SVG clipPath for rounded hexagon
- **iOS**: SwiftUI View with custom `RoundedPointyTopHexagon` Shape
- **Android**: Jetpack Compose with custom `GenericShape` for hexagon

**New Tokens**:
- 5 semantic color tokens (`color.avatar.human`, `color.avatar.agent`, etc.)
- 6 avatar size tokens (`avatar.size.xs` through `avatar.size.xxl`)
- 2 component tokens for icon sizing gaps

---

## Infrastructure Improvements

### AI Collaboration Framework Enhancement

New steering documentation for systematic AI-human collaboration:
- **AI-Collaboration-Principles.md**: Core skepticism and candid communication requirements
- **AI-Collaboration-Framework.md**: Detailed protocols, validation gates, and bias mitigation
- Mandatory counter-arguments for all AI recommendations
- Candid vs brutal communication guidelines
- Objective validation gates immune to AI optimism bias

### MCP Documentation Server

Enhanced documentation infrastructure with progressive disclosure:
- 50+ indexed steering documents
- 88-96% token compression through section-level queries
- Cross-reference tracking and validation
- Health monitoring and index rebuild capabilities

### Release Analysis System Fixes

- Fixed `convertOrchestratorResult()` display bug that caused crashes
- Cleaned up 27,000+ accumulated state files
- Analysis now properly detects all completion documents
- Performance: ~12 seconds for full analysis (322 documents)

---

## Breaking Changes

### Internal Infrastructure Changes

The following internal changes may affect custom integrations:

1. **Architecture Separation of Concerns** (Spec architecture-separation-of-concerns)
   - Common interfaces extracted for validation
   - Validation logic extracted from TokenFileGenerator
   - Validation logic extracted from Registries

2. **Release Detection Trigger Cleanup** (Spec release-detection-trigger-fix)
   - Old test files and configurations removed
   - Hook configurations updated

3. **Test Failure Detection Logic** (Spec test-failure-fixes)
   - Detection logic changes for improved accuracy

4. **Steering Token-First Enhancement** (Spec steering-token-first-enhancement)
   - Token governance documentation restructured

**Note**: These changes are internal infrastructure improvements. Public component APIs remain unchanged.

---

## Test Suite

- **284+ test suites** passing
- **6,800+ tests** passing
- All Avatar component tests validated
- Cross-platform consistency verified

---

## Specifications Completed

| Spec | Title | Tasks |
|------|-------|-------|
| 042 | Avatar Component | 10 tasks |

---

## Upgrade Notes

1. **No action required** for most users — public component APIs unchanged
2. If you have custom integrations with release analysis or validation infrastructure, review the breaking changes section
3. New Avatar component is available for immediate use

---

## Related Documentation

- [Spec 042 Tasks](.kiro/specs/042-avatar-component/tasks.md)
- [Avatar Design Outline](.kiro/specs/042-avatar-component/design-outline.md)
- [AI Collaboration Principles](.kiro/steering/AI-Collaboration-Principles.md)
- [Component Development Guide](.kiro/steering/Component-Development-Guide.md)
