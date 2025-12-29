# Design Outline: Blend Infrastructure Implementation

**Date**: December 28, 2025
**Spec**: 031 - Blend Infrastructure Implementation
**Status**: Design Outline (Pre-Spec)
**Dependencies**: 024-blend-token-infrastructure-audit (completed)
**Type**: Implementation

---

## Executive Summary

This design outline defines the scope, approach, and success criteria for implementing blend token runtime infrastructure. The implementation addresses all 9 gaps identified in Spec 024's audit, enabling components to consume blend tokens as originally designed.

**Root Cause Being Addressed**:
> Blend tokens are defined as calculation parameters, but no mechanism exists to execute the calculation and deliver a consumable color value to components.

**Solution**: Integrate existing BlendUtilityGenerator into the build pipeline, providing platform-native runtime utilities that components can consume.

---

## Scope Definition

### In Scope

| Area | Description |
|------|-------------|
| Build Pipeline Integration | Integrate BlendUtilityGenerator into TokenFileGenerator |
| Platform Utility Generation | Generate blend utilities for Web, iOS, and Android |
| Component Updates | Update existing components to use blend utilities |
| Theme Support | Create theme-aware wrapper functions |
| Documentation | Update component guides and AI agent guidance |
| Cross-Platform Testing | Validate visual parity across platforms |

### Out of Scope

| Area | Rationale |
|------|-----------|
| New blend token definitions | Existing tokens are complete (per Spec 024 Phase 1) |
| BlendCalculator modifications | Existing algorithms are correct |
| Composition parser changes | Existing parsers work correctly |
| New component creation | Focus on existing components only |

---

## Approach: Runtime Utility Integration

### Current State (Gap)

```
┌─────────────────────┐     ┌─────────────────────┐
│ BlendUtilityGenerator│     │ TokenFileGenerator  │
│ (exists, orphaned)  │     │ (orchestrator)      │
└─────────────────────┘     └─────────────────────┘
         ↓                           ↓
    [NOT CALLED]              [Generates tokens]
         ↓                           ↓
    [No output]               [dist/DesignTokens.*]
```

### Target State (Solution)

```
┌─────────────────────┐     ┌─────────────────────┐
│ BlendUtilityGenerator│────→│ TokenFileGenerator  │
│ (integrated)        │     │ (orchestrator)      │
└─────────────────────┘     └─────────────────────┘
         ↓                           ↓
    [Called by TFG]           [Generates tokens]
         ↓                           ↓
    [Utilities in output]     [dist/DesignTokens.*]
```

### Why This Approach

1. **Generators already exist** - BlendUtilityGenerator produces valid code
2. **Follows existing patterns** - GP-001 through GP-004 from Phase 2 Pattern Inventory
3. **Cross-platform consistency** - Same algorithm, platform-native implementation
4. **Minimal new code** - Integration, not creation

---

## Implementation Phases

### Phase 0: Spec Development (This Outline → Full Spec)
- Human review of design-outline
- Create full requirements.md, design.md, tasks.md
- Estimated: 1 day

### Phase 1: Build Integration
**Primary Deliverable**: Blend utilities in build output

| Task | Description |
|------|-------------|
| 1.1 | Integrate BlendUtilityGenerator into TokenFileGenerator |
| 1.2 | Generate Web utilities (`dist/BlendUtilities.web.ts`) |
| 1.3 | Generate iOS utilities (`dist/BlendUtilities.ios.swift`) |
| 1.4 | Generate Android utilities (`dist/BlendUtilities.android.kt`) |
| 1.5 | Export utilities from package |
| 1.6 | Cross-platform validation tests |

**Estimated Effort**: 2-3 days

**Addresses Gaps**: GAP-002 (consistent transformations), GAP-004 (predictable behavior), GAP-005 (cross-platform consistency)

### Phase 2: Component Updates
**Primary Deliverable**: Components using blend utilities

| Task | Description |
|------|-------------|
| 2.1 | Update ButtonCTA (hover, pressed, disabled, icon) |
| 2.2 | Update TextInputField (focus, disabled) |
| 2.3 | Update Container (hover) |
| 2.4 | Update Icon (optical balance) |
| 2.5 | Remove workarounds from all components |
| 2.6 | Component integration tests |

**Estimated Effort**: 3-5 days

**Addresses Gaps**: GAP-001 (focus states), GAP-006 (hover), GAP-007 (pressed), GAP-008 (disabled), GAP-009 (icon balance)

### Phase 3: Theme Support
**Primary Deliverable**: Theme-aware blend utilities

| Task | Description |
|------|-------------|
| 3.1 | Create theme-aware wrapper functions |
| 3.2 | Update components to use theme context |
| 3.3 | Document theme-aware patterns |
| 3.4 | Theme switching tests |

**Estimated Effort**: 1-2 days

**Addresses Gaps**: GAP-003 (theme-aware modifications)

**Total Estimated Effort**: 7-11 days

---

## Platform-Specific Utilities

### Web (TypeScript)

**Output**: `dist/BlendUtilities.web.ts`

```typescript
export function darkerBlend(color: string, blendAmount: number): string;
export function lighterBlend(color: string, blendAmount: number): string;
export function saturate(color: string, blendAmount: number): string;
export function desaturate(color: string, blendAmount: number): string;
```

**Component Consumption**:
```typescript
import { darkerBlend } from '@designerpunk/tokens/BlendUtilities';
import { DesignTokens } from '@designerpunk/tokens';

const hoverColor = darkerBlend(
  DesignTokens.color.primary,
  DesignTokens.blend.hoverDarker
);
```

### iOS (Swift)

**Output**: `dist/BlendUtilities.ios.swift`

```swift
extension Color {
    func darkerBlend(_ amount: Double) -> Color
    func lighterBlend(_ amount: Double) -> Color
    func saturate(_ amount: Double) -> Color
    func desaturate(_ amount: Double) -> Color
}
```

**Component Consumption**:
```swift
DesignTokens.color.primary.darkerBlend(DesignTokens.blend.hoverDarker)
```

### Android (Kotlin)

**Output**: `dist/BlendUtilities.android.kt`

```kotlin
fun Color.darkerBlend(amount: Float): Color
fun Color.lighterBlend(amount: Float): Color
fun Color.saturate(amount: Float): Color
fun Color.desaturate(amount: Float): Color
```

**Component Consumption**:
```kotlin
DesignTokens.color_primary.darkerBlend(DesignTokens.blend_hover_darker)
```

---

## Success Criteria

### Technical Success Criteria

| Criterion | Validation |
|-----------|------------|
| BlendUtilityGenerator integrated into build pipeline | Build produces utility files |
| Utilities generated for all three platforms | Files exist in dist/ |
| Cross-platform tests pass | Identical color results |
| Package exports utilities correctly | Import works in consuming code |
| No breaking changes | Existing token imports unchanged |

### User Need Success Criteria (from Spec 024)

| Need ID | Criterion | Validation |
|---------|-----------|------------|
| UN-001 | Focus states use saturation modification | TextInputField focus uses `saturate()` |
| UN-002 | Hover states use color darkening | ButtonCTA hover uses `darkerBlend()` |
| UN-003 | Pressed states use color darkening | ButtonCTA pressed uses `darkerBlend()` |
| UN-004 | Disabled states use desaturation | ButtonCTA/TextInputField use `desaturate()` |
| UN-005 | Icons use precise lightening | Icon uses `lighterBlend()` |
| UN-006 | All components use same utilities | No component-specific workarounds |
| UN-007 | Theme-aware patterns working | Light/dark mode correct |
| UN-008 | Clear consumption pattern documented | Developer guide updated |
| UN-010 | Visual parity across platforms | Cross-platform tests pass |

### Workaround Removal Criteria

| Component | Current Workaround | Target State |
|-----------|-------------------|--------------|
| ButtonCTA (Web) | `opacity: 0.92` for hover | `darkerBlend()` |
| ButtonCTA (Web) | `opacity: 0.84` for pressed | `darkerBlend()` |
| ButtonCTA (Web) | `filter: brightness(1.08)` for icon | `lighterBlend()` |
| ButtonCTA (iOS) | `scaleEffect(0.96)` for pressed | `darkerBlend()` |
| ButtonCTA (Android) | Material ripple for pressed | `darkerBlend()` |
| TextInputField | Direct `color.primary` for focus | `saturate()` |
| All components | `opacity: 0.6` for disabled | `desaturate()` |

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Color calculation precision | Low | Medium | Use existing BlendCalculator algorithms |
| Platform-specific color handling | Medium | Medium | Extensive cross-platform testing |
| Bundle size increase | Low | Low | Utilities are small (~2KB per platform) |
| Breaking changes | Low | High | Additive changes only, no removal |

### Adoption Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Developer learning curve | Medium | Low | Clear documentation and examples |
| Workaround removal resistance | Low | Low | Gradual migration, not forced |
| AI agent guidance updates | Low | Low | Update existing documentation |

---

## Dependencies

### Required Before Implementation

| Dependency | Status | Notes |
|------------|--------|-------|
| Spec 024 audit complete | ✅ Complete | Findings inform this spec |
| BlendUtilityGenerator exists | ✅ Complete | `src/generators/BlendUtilityGenerator.ts` |
| BlendCalculator exists | ✅ Complete | `src/blend/BlendCalculator.ts` |
| TokenFileGenerator exists | ✅ Complete | `src/generators/TokenFileGenerator.ts` |

### Enables Future Work

| Dependent | Description |
|-----------|-------------|
| New components | Can use blend utilities from day one |
| Theme system expansion | Foundation for advanced theming |
| Design system consistency | All components follow same patterns |

---

## Reference Documents

### Spec 024 Audit Findings

| Document | Purpose |
|----------|---------|
| `findings/gap-analysis.md` | Consolidated gap analysis |
| `findings/confirmed-actions.md` | Human-reviewed decisions |
| `findings/extracted-needs.md` | User needs (UN-001 through UN-010) |
| `findings/modern-solutions.md` | Solution proposals |
| `findings/pattern-inventory.md` | Current system patterns |

### Existing Infrastructure

| File | Purpose |
|------|---------|
| `src/generators/BlendUtilityGenerator.ts` | Utility generation (orphaned) |
| `src/generators/BlendValueGenerator.ts` | Value generation |
| `src/blend/BlendCalculator.ts` | Calculation algorithms |
| `src/blend/ColorSpaceUtils.ts` | RGB↔HSL conversion |
| `src/tokens/BlendTokens.ts` | Primitive tokens |
| `src/tokens/semantic/BlendTokens.ts` | Semantic tokens |

---

## Human Checkpoint

**This design-outline requires human review before proceeding to full spec development.**

### Review Questions

1. Does the scope accurately capture what needs to be implemented?
2. Is the phased approach appropriate (Build → Components → Theme)?
3. Are the success criteria comprehensive and measurable?
4. Is the estimated effort (7-11 days) reasonable?
5. Are there any additional risks or dependencies to consider?

### Next Steps (Upon Approval)

1. Create `requirements.md` for Spec 031
2. Create `design.md` for Spec 031
3. Create `tasks.md` for Spec 031
4. Begin Phase 1 implementation

---

*This design-outline defines the scope, approach, and success criteria for Spec 031. Upon human approval, full spec documents will be created.*
