# Needs Catalog: Blend Token Infrastructure Audit

**Date**: December 28, 2025
**Spec**: 024 - Blend Token Infrastructure Audit
**Phase**: 1 - Needs Discovery
**Task**: 1.1 - Catalog blend-tokens spec expectations
**Organization**: spec-validation
**Scope**: 024-blend-token-infrastructure-audit

---

## Overview

This document catalogs all blend-related expectations from the blend-tokens spec (marked complete) and Spec 023 escalations. Each expectation is verified against actual artifacts and assigned a lineage category.

**Source Documents Reviewed**:
- `.kiro/specs/blend-tokens/tasks.md` - Original blend token spec (all tasks marked complete)
- `.kiro/specs/023-component-token-compliance-audit/findings/` - Escalation source

---

## Lineage Categories

| Category | Definition | Action Implication |
|----------|------------|-------------------|
| **Claimed-not-built** | Task marked complete but artifact doesn't exist | Assess if still needed |
| **Built-but-outdated** | Exists but doesn't match current patterns | Modernize or replace |
| **Escalated-never-addressed** | Explicitly deferred to future spec that wasn't created | Extract the *need*, not the implementation |
| **Superseded** | Original need addressed differently elsewhere | Document and close |
| **Still-needed** | Gap remains valid with current architecture | Plan modern implementation |
| **Built-and-current** | Artifact exists and matches current patterns | No action needed |

---

## Task 1: Implement Blend Primitive Tokens

### NC-001: Primitive Blend Token Definitions
**Source**: blend-tokens/tasks.md Task 1.1
**Claim**: Create BlendTokens.ts with base value and token definitions (blend100-blend500)
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/tokens/BlendTokens.ts` exists with:
  - `BLEND_BASE_VALUE = 0.04`
  - `BlendDirection` enum (darker, lighter, saturate, desaturate)
  - `generateBlendPlatformValues()` helper
  - `blend100` through `blend500` tokens with mathematical relationships
  - Proper `PrimitiveToken` interface implementation

**Verification**: Artifact exists and matches spec expectations.

---

### NC-002: Primitive Blend Token Tests
**Source**: blend-tokens/tasks.md Task 1.2
**Claim**: Create unit tests for blend primitive tokens
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/tokens/__tests__/BlendTokens.test.ts` exists
- Tests verify base value, mathematical relationships, unitless platform values

**Verification**: Artifact exists and matches spec expectations.

---

## Task 2: Implement Blend Calculation Algorithms

### NC-003: Color Space Conversion Utilities
**Source**: blend-tokens/tasks.md Task 2.1
**Claim**: Implement color space conversion utilities (RGB↔HSL, hex parsing)
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/blend/ColorSpaceUtils.ts` exists with:
  - `rgbToHsl()` conversion function
  - `hslToRgb()` conversion function
  - `hexToRgb()` parsing function
  - `rgbToHex()` formatting function
  - All four blend calculation functions

**Verification**: Artifact exists and matches spec expectations.

---

### NC-004: Blend Calculator Orchestrator
**Source**: blend-tokens/tasks.md Task 2.6
**Claim**: Create BlendCalculator orchestrator that routes to correct blend function
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/blend/BlendCalculator.ts` exists with:
  - `BlendCalculator` class
  - `calculateBlend()` method routing to darker/lighter/saturate/desaturate
  - Convenience function export

**Verification**: Artifact exists and matches spec expectations.

---

## Task 3: Implement Blend Semantic Layer

### NC-005: Semantic Blend Token Definitions
**Source**: blend-tokens/tasks.md Task 3.1
**Claim**: Create semantic blend tokens (hoverDarker, hoverLighter, pressedDarker, focusSaturate, disabledDesaturate, containerHoverDarker)
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-001, UN-002, UN-003, UN-004, UN-005, UN-007 (see extracted-needs.md)

**Evidence**:
- `src/tokens/semantic/BlendTokens.ts` exists with:
  - `blend.hoverDarker` (blend200 darker)
  - `blend.hoverLighter` (blend200 lighter)
  - `blend.pressedDarker` (blend300 darker)
  - `blend.focusSaturate` (blend200 saturate)
  - `blend.disabledDesaturate` (blend300 desaturate)
  - `blend.containerHoverDarker` (blend100 darker)
  - `color.icon.opticalBalance` (blend200 lighter)
  - AI Agent guidance documentation

**Verification**: Artifact exists and matches spec expectations.

---

## Task 4: Integrate Blend Tokens with Unified Generator

### NC-006: Blend Value Generator
**Source**: blend-tokens/tasks.md Task 4.1
**Claim**: Implement blend value generator for all platforms
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-010 (see extracted-needs.md)

**Evidence**:
- `src/generators/BlendValueGenerator.ts` exists with:
  - `generateWebBlendValues()` method
  - `generateiOSBlendValues()` method
  - `generateAndroidBlendValues()` method
  - Platform-specific formatting (web: export const, iOS: static let, Android: const val)

**Verification**: Artifact exists and matches spec expectations.

---

### NC-007: Web Blend Utility Generator
**Source**: blend-tokens/tasks.md Task 4.2
**Claim**: Generate darkerBlend(), lighterBlend(), saturate(), desaturate() functions for web
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-010 (see extracted-needs.md)

**Evidence**:
- `src/generators/BlendUtilityGenerator.ts` exists with:
  - `generateWebBlendUtilities()` method
  - Generates TypeScript functions for all four blend directions
  - Includes color space utilities

**Verification**: Artifact exists and matches spec expectations.

---

### NC-008: iOS Blend Utility Generator
**Source**: blend-tokens/tasks.md Task 4.3
**Claim**: Generate Color extension methods for iOS (Swift)
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-010 (see extracted-needs.md)

**Evidence**:
- `src/generators/BlendUtilityGenerator.ts` includes:
  - `generateiOSBlendUtilities()` method
  - Generates Swift Color extension with darkerBlend, lighterBlend, saturate, desaturate methods
  - Includes RGB/HSL structs and conversion utilities

**Verification**: Artifact exists and matches spec expectations.

---

### NC-009: Android Blend Utility Generator
**Source**: blend-tokens/tasks.md Task 4.4
**Claim**: Generate Color extension functions for Android (Kotlin)
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-010 (see extracted-needs.md)

**Evidence**:
- `src/generators/BlendUtilityGenerator.ts` includes:
  - `generateAndroidBlendUtilities()` method
  - Generates Kotlin Color extension functions
  - Includes RGB/HSL data classes and conversion utilities

**Verification**: Artifact exists and matches spec expectations.

---

### NC-010: Cross-Platform Consistency Tests
**Source**: blend-tokens/tasks.md Task 4.5
**Claim**: Create cross-platform consistency tests verifying identical colors
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-010 (see extracted-needs.md)

**Evidence**:
- `src/__tests__/integration/BlendCrossPlatformConsistency.test.ts` exists
- Tests verify all platforms generate same blend values
- Tests verify mathematical consistency across platforms

**Verification**: Artifact exists and matches spec expectations.

---

### NC-011: Unified Generator Integration
**Source**: blend-tokens/tasks.md Task 4.1 (sub-bullet)
**Claim**: "Integrate with existing unified generator infrastructure"
**Lineage**: ⚠️ **Built-but-outdated**
**Extracted Need**: UN-008 (see extracted-needs.md)

**Evidence**:
- BlendValueGenerator and BlendUtilityGenerator exist as standalone classes
- No "UnifiedGenerator" class found in codebase (grep search returned no results)
- Generators are self-contained and not integrated into a central orchestration system
- Other token families (opacity, color) appear to follow similar standalone patterns

**Assessment**: The "unified generator" mentioned in the spec may have been a conceptual goal rather than an actual infrastructure component. The generators work correctly but are not integrated into a central system. This may be acceptable given current architecture patterns.

**Verification**: Generators exist but integration claim needs assessment against current patterns.

---

## Task 5: Implement Composition Support

### NC-012: Blend Composition Parser
**Source**: blend-tokens/tasks.md Task 5.1
**Claim**: Implement blend composition parser for "color with blend direction" syntax
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/composition/BlendCompositionParser.ts` exists with:
  - `parse()` method for "color with blend direction" syntax
  - Token validation against registries
  - Direction validation
  - `isBlendComposition()` syntax checker
- `src/composition/BlendComposition.ts` defines interfaces

**Verification**: Artifact exists and matches spec expectations.

---

### NC-013: Blend + Opacity Composition
**Source**: blend-tokens/tasks.md Task 5.2
**Claim**: Implement "color with blend direction at opacity" syntax
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/composition/OpacityCompositionParser.ts` includes:
  - `parseBlendOpacityComposition()` method
  - Enforces order: blend first, then opacity
  - Returns `BlendOpacityComposition` structure
- `src/composition/OpacityComposition.ts` defines `BlendOpacityComposition` interface

**Verification**: Artifact exists and matches spec expectations. Coordinated with opacity-tokens spec.

---

### NC-014: Composition Tests
**Source**: blend-tokens/tasks.md Task 5.3
**Claim**: Create composition tests for all patterns
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: N/A (infrastructure complete)

**Evidence**:
- `src/composition/__tests__/BlendCompositionParser.test.ts` exists (36 tests)
- `src/composition/__tests__/OpacityCompositionParser.test.ts` includes blend+opacity tests (43 tests)

**Verification**: Artifact exists and matches spec expectations.

---

## Task 6: Documentation and Usage Guidance

### NC-015: Blend Usage Guide
**Source**: blend-tokens/tasks.md Task 6.1
**Claim**: Create blend usage guide with examples for all directions
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-008 (see extracted-needs.md)

**Evidence**:
- `.kiro/specs/blend-tokens/blend-usage-guide.md` exists

**Verification**: Artifact exists.

---

### NC-016: Blend vs Explicit Colors Guidance
**Source**: blend-tokens/tasks.md Task 6.2
**Claim**: Document when to use blend vs explicit colors
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-008 (see extracted-needs.md)

**Evidence**:
- `.kiro/specs/blend-tokens/blend-vs-explicit-colors.md` exists

**Verification**: Artifact exists.

---

### NC-017: AI Agent Guidance
**Source**: blend-tokens/tasks.md Task 6.3
**Claim**: Create AI agent guidance for blend selection
**Lineage**: ✅ **Built-and-current**
**Extracted Need**: UN-009 (see extracted-needs.md)

**Evidence**:
- `.kiro/specs/blend-tokens/ai-agent-blend-selection-guide.md` exists
- `src/tokens/semantic/BlendTokens.ts` includes inline AI Agent guidance

**Verification**: Artifact exists.

---

## Spec 023 Escalations

**Source Documents Reviewed** (Task 1.2):
- `.kiro/specs/023-component-token-compliance-audit/findings/final-compliance-report.md`
- `.kiro/specs/023-component-token-compliance-audit/findings/textinputfield-audit-findings.md`
- `.kiro/specs/023-component-token-compliance-audit/findings/textinputfield-confirmed-actions.md`
- `.kiro/specs/023-component-token-compliance-audit/findings/buttoncta-audit-findings.md`
- `.kiro/specs/023-component-token-compliance-audit/findings/cross-component-consistency-check.md`
- `.kiro/specs/023-component-token-compliance-audit/findings/icon-audit-findings.md`

---

### NC-018: E1: H1 - Blend Token Runtime Application Infrastructure (PRIMARY ESCALATION)
**Source**: Spec 023 - textinputfield-confirmed-actions.md (E1: H1)
**Original Finding**: textinputfield-audit-findings.md Issue H1
**Claim**: TextInputField should use `blend.focusSaturate` for focus states, but no platform implements this
**Lineage**: ⚠️ **Escalated-never-addressed**

**Original Finding Text** (from textinputfield-audit-findings.md):
> "The component spec and README document that focus states should use `blend.focusSaturate` to enhance the primary color (8% more saturated), but none of the platform implementations actually apply this blend token. The implementations use `color.primary` directly without the saturation enhancement."

**Current State** (per Spec 023):
- **Spec/README**: Documents `blend.focusSaturate` usage for focus state
- **Web**: Uses `var(--color-primary)` directly
- **iOS**: Uses `colorPrimary` directly
- **Android**: Uses `colorPrimary` directly

**Escalation Decision** (from textinputfield-confirmed-actions.md):
> "Escalate to: Spec 024 - Blend Token System Implementation"
> "No Action for Spec 023: Implementations are correct for current token system state. TextInputField uses `color.primary` directly, which is acceptable as interim state until Spec 024 implements blend token infrastructure."

**Required Infrastructure** (per Spec 023 escalation):
1. **Blend Token Definition**: Formalize blend token types and composition rules
2. **Platform Implementation**:
   - Web: CSS `color-mix()` or filter-based saturation adjustment
   - iOS: Color manipulation APIs for saturation adjustment
   - Android: Color manipulation APIs for saturation adjustment
3. **Build System Integration**: Generate platform-specific blend application code
4. **Component Updates**: Update TextInputField and other components to apply blend tokens

**Underlying Need**: Components need a way to apply blend modifications to colors at runtime for interactive states (focus, hover, pressed).
**Extracted Need**: UN-001, UN-008 (see extracted-needs.md)

**Verification**: This is the primary gap - blend tokens are defined but not consumable by components.

---

### NC-019: Blend Token Usage in ButtonCTA
**Source**: Spec 023 - buttoncta-audit-findings.md (I3), buttoncta-confirmed-actions.md
**Claim**: ButtonCTA should use blend tokens for optical balance and disabled states
**Lineage**: ⚠️ **Still-needed** (partial)

**Evidence from buttoncta-audit-findings.md**:
- **Issue I3**: "The iOS implementation uses `colorPrimary` directly for secondary/tertiary button icons with a comment claiming 'no semantic icon.opticalBalance token exists'. However, verification of `DesignTokens.ios.swift` confirms that `colorIconOpticalBalance` DOES exist (line 530)."
- **Issue W5** (Web): CSS filter approximation used instead of blend token
- **Issue W6** (Web): Hard-coded `opacity: 0.5` for disabled state instead of `blend.disabledDesaturate`

**Tokens That Exist**:
- `color.icon.opticalBalance` - defined in semantic blend tokens (blend200 lighter)
- `blend.disabledDesaturate` - defined in semantic blend tokens (blend300 desaturate)

**Assessment**: 
The tokens exist but the gap is the same as NC-018: no runtime application infrastructure. The iOS token `colorIconOpticalBalance` is defined as `blend200` (the blend value 0.08), not as a pre-computed color. Components need infrastructure to apply this blend to a base color.
**Extracted Need**: UN-004, UN-005 (see extracted-needs.md)

**Verification**: Tokens exist but cannot be applied by components.

---

### NC-020: Cross-Component Blend Token Consistency
**Source**: Spec 023 - cross-component-consistency-check.md
**Claim**: Blend tokens should be used consistently across components
**Lineage**: ⚠️ **Still-needed**

**Evidence from cross-component-consistency-check.md**:
> "Blend Tokens - Purpose: Consistent color transformations across components"
> 
> | Token | Purpose | Components Using | Status |
> |-------|---------|------------------|--------|
> | `color.icon.opticalBalance` | 8% lighter for optical weight | Icon, ButtonCTA | ✅ Consistent |
> | `blend.disabledDesaturate` | 12% less saturated for disabled | ButtonCTA | ✅ Consistent |
> | `blend.focusSaturate` | 8% more saturated for focus | TextInputField (escalated to Spec 024) | ⚠️ Pending |

**Final Compliance Report Summary**:
> "1 token infrastructure escalated to Spec 024"
> "Escalated to Spec 024: `blend.focusSaturate` runtime infrastructure for focus state emphasis. Current implementations use `color.primary` directly (acceptable interim state)."

**Assessment**: The consistency check reveals the same underlying gap - blend tokens are defined but lack runtime application infrastructure. The "consistent" status for `color.icon.opticalBalance` and `blend.disabledDesaturate` refers to documentation consistency, not actual implementation.
**Extracted Need**: UN-006 (see extracted-needs.md)

**Verification**: Tokens exist but cannot be applied by components.

---

### NC-021: Icon Optical Balance Blend Token
**Source**: Spec 023 - icon-audit-findings.md, final-compliance-report.md
**Claim**: Icon component should use optical balance blend token for secondary/tertiary icons
**Lineage**: ⚠️ **Still-needed**

**Evidence from final-compliance-report.md**:
> "Tokens Created: `color.icon.default` - Default icon color with optical balance (mode-aware)"
> "Optical balance blend token applied to secondary/tertiary icons"

**Evidence from icon-audit-findings.md**:
> "Issue I3: Missing colorIconOpticalBalance Token Usage"
> "The iOS implementation uses `colorPrimary` directly for secondary/tertiary button icons"

**Assessment**: 
- `color.icon.opticalBalance` token was created during Spec 023
- Token is defined as `blend200` (lighter direction)
- The gap is applying this blend to the base color at runtime
**Extracted Need**: UN-005 (see extracted-needs.md)

**Verification**: Token exists but runtime application infrastructure is missing.

---

## Summary by Lineage Category

### Built-and-current (No Action Needed): 14 items
- NC-001 through NC-010: Core blend token infrastructure
- NC-012 through NC-017: Composition support and documentation

### Built-but-outdated (Assess for Modernization): 1 item
- NC-011: Unified generator integration claim

### Escalated-never-addressed (Extract Need): 1 item
- NC-018: E1: H1 - Blend token runtime application infrastructure (PRIMARY ESCALATION from Spec 023)

### Still-needed (Plan Implementation): 3 items
- NC-019: ButtonCTA blend token usage
- NC-020: Cross-component blend token consistency
- NC-021: Icon optical balance blend token

---

## Needs Catalog to Extracted Needs Cross-Reference

| Catalog ID | Lineage | Extracted Need(s) | Theme |
|------------|---------|-------------------|-------|
| NC-001 | Built-and-current | N/A | Infrastructure |
| NC-002 | Built-and-current | N/A | Infrastructure |
| NC-003 | Built-and-current | N/A | Infrastructure |
| NC-004 | Built-and-current | N/A | Infrastructure |
| NC-005 | Built-and-current | UN-001, UN-002, UN-003, UN-004, UN-005, UN-007 | Interactive States, Visual Hierarchy |
| NC-006 | Built-and-current | UN-010 | Cross-Platform Consistency |
| NC-007 | Built-and-current | UN-010 | Cross-Platform Consistency |
| NC-008 | Built-and-current | UN-010 | Cross-Platform Consistency |
| NC-009 | Built-and-current | UN-010 | Cross-Platform Consistency |
| NC-010 | Built-and-current | UN-010 | Cross-Platform Consistency |
| NC-011 | Built-but-outdated | UN-008 | Developer Experience |
| NC-012 | Built-and-current | N/A | Infrastructure |
| NC-013 | Built-and-current | N/A | Infrastructure |
| NC-014 | Built-and-current | N/A | Infrastructure |
| NC-015 | Built-and-current | UN-008 | Developer Experience |
| NC-016 | Built-and-current | UN-008 | Developer Experience |
| NC-017 | Built-and-current | UN-009 | Developer Experience |
| NC-018 | Escalated-never-addressed | UN-001, UN-008 | Interactive States, Developer Experience |
| NC-019 | Still-needed | UN-004, UN-005 | Disabled States, Visual Hierarchy |
| NC-020 | Still-needed | UN-006 | Theme Consistency |
| NC-021 | Still-needed | UN-005 | Visual Hierarchy |

---

## Cross-Reference: Spec 023 to blend-tokens Spec

| Spec 023 Finding | Related blend-tokens Expectation | Gap Type |
|------------------|----------------------------------|----------|
| E1: H1 - TextInputField focus state | NC-005 (semantic blend tokens exist) | Runtime application |
| I3 - ButtonCTA optical balance | NC-005 (color.icon.opticalBalance exists) | Runtime application |
| W5/W6 - ButtonCTA disabled state | NC-005 (blend.disabledDesaturate exists) | Runtime application |
| Cross-component consistency | NC-006-NC-009 (generators exist) | Build pipeline integration |

**Key Insight**: All Spec 023 escalations trace back to the same root cause - blend tokens are defined (NC-005) and generators exist (NC-006-NC-009), but the generated utilities are not integrated into the build pipeline and components have no pattern for consuming them.

---

## Key Finding

**The blend token DEFINITION infrastructure is complete and current.** All primitive tokens, semantic tokens, calculation algorithms, generators, composition parsers, and documentation exist and match spec expectations.

**The gap is in RUNTIME APPLICATION.** Components cannot consume blend tokens because:
1. No platform-specific utilities are generated into the actual output files
2. No component patterns exist for applying blend modifications
3. The generators exist but their output is not integrated into the build pipeline

**This is a single underlying gap manifesting in multiple escalations (NC-018, NC-019, NC-020, NC-021).**

---

*This catalog will be used in Task 1.4 to extract underlying user needs divorced from implementation expectations.*
