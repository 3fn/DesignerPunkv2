# Semantic Token Naming Audit Findings (Comprehensive)

**Date**: January 24, 2026
**Spec**: 051 - Semantic Token Naming Restructure
**Audit Type**: Comprehensive Token Naming Pattern Analysis (All Semantic Families)
**Status**: Audit Phase Complete - Ready for Human Review
**Target Pattern**: `[family].[component].[property].[variant]`

---

## Executive Summary

This comprehensive audit evaluated **all 17 semantic token families** to determine which require restructuring. The audit found that **only color tokens** need migration — other families already follow clear, domain-appropriate patterns.

**Why Color Is Different**: Color tokens are unique because they apply to multiple CSS properties (background, text, border, icon). Other token families don't have this ambiguity.

### All Semantic Token Families Audited

| Family | Token Count | Needs Restructuring? | Rationale |
|--------|-------------|---------------------|-----------|
| **Color** | 40 | ✅ **YES** | Applies to multiple CSS properties |
| Accessibility | 3 | ❌ No | Property already explicit |
| Blend | 7 | ❌ No | Context-based, clear semantic |
| BorderWidth | 4 | ❌ No | Single property (border-width) |
| Elevation | 7 | ❌ No | Android-specific, context-based |
| GridSpacing | 10 | ❌ No | Clear breakpoint-based naming |
| Icon | 12 | ❌ No | Property explicit (size, strokeWidth) |
| Layering/ZIndex | 6 | ❌ No | Context-based, single property |
| Motion | 5 | ❌ No | Composite tokens, context-based |
| Opacity | 4 | ❌ No | Single property (opacity) |
| Radius | 7 | ❌ No | Single property (border-radius) |
| Shadow | 14 | ❌ No | Single property (box-shadow) |
| Spacing | ~25 | ❌ No | Hierarchical, clear semantic |
| Typography | 24 | ❌ No | Composite tokens, context-based |

### Color Token Audit Summary

- **40 total semantic color tokens** in `src/tokens/semantic/ColorTokens.ts`
- **26 tokens require migration** to conform to target pattern
- **10 tokens already conform** (text, icon, badge, some surface tokens)
- **4 tokens need decisions** (glow family, canvas, onPrimary)

---

## Canonical Pattern: Prepared Fallback

The `[family].[component].[property].[variant]` pattern is established as the **canonical fallback** for any semantic token family that develops property-level ambiguity in the future.

### When to Apply This Pattern

**Apply when**: A token family applies to multiple CSS properties and the property isn't obvious from context.

**Current application**: Color tokens (this spec)

**Future application**: Any token family that develops property ambiguity. For example, if we ever needed modal-specific shadows for different properties:
- `shadow.modal.boxShadow.default` (hypothetical)
- `shadow.modal.textShadow.glow` (hypothetical)

### Why Other Families Don't Need This Pattern Now

| Family | Why Current Pattern Works |
|--------|---------------------------|
| Shadow | Only applies to `box-shadow` — no ambiguity |
| Typography | Composite token for text styling — no ambiguity |
| Spacing | Only applies to spacing properties — no ambiguity |
| Radius | Only applies to `border-radius` — no ambiguity |
| Motion | Composite token for animation — no ambiguity |
| Opacity | Only applies to `opacity` — no ambiguity |

---

## Color Token Target Architecture

### Pattern: `[family].[component].[property].[variant]`

| Segment | Description | Examples |
|---------|-------------|----------|
| `family` | Token category | `color`, `glow`, `shadow` |
| `component` | Semantic context or component | `feedback`, `avatar`, `select`, `text`, `background` |
| `property` | CSS property being styled | `background`, `text`, `border`, `icon` |
| `variant` | State or variation | `success`, `error`, `default`, `selected`, `human` |

### Examples of Target Pattern

```
color.feedback.background.success    // Success state background
color.feedback.text.error            // Error state text
color.avatar.background.human        // Human avatar background
color.select.text.selected           // Selected state text
color.text.body.default              // Default body text
```

---

## Color Token Inventory Against Target Pattern

### Category 1: Component-Specific Tokens (11 tokens)

#### Avatar Tokens (5 tokens) - ❌ MIGRATION REQUIRED

| Current Name | Primitive | Issue | Target Name |
|--------------|-----------|-------|-------------|
| `color.avatar.human` | orange300 | Missing property segment | `color.avatar.background.human` |
| `color.avatar.agent` | teal200 | Missing property segment | `color.avatar.background.agent` |
| `color.avatar.contrast.onHuman` | white100 | Non-standard `contrast.on*` | `color.avatar.icon.human` |
| `color.avatar.contrast.onAgent` | white100 | Non-standard `contrast.on*` | `color.avatar.icon.agent` |
| `color.avatar.border` | gray100 | Missing variant segment | `color.avatar.border.default` |

#### Select Tokens (4 tokens) - ❌ MIGRATION REQUIRED

| Current Name | Primitive | Issue | Target Name |
|--------------|-----------|-------|-------------|
| `color.select.selected.strong` | cyan400 | `strong` = foreground (confusing) | `color.select.text.selected` |
| `color.select.selected.subtle` | cyan100 | `subtle` = background (confusing) | `color.select.background.selected` |
| `color.select.notSelected.strong` | gray200 | `strong` = foreground (confusing) | `color.select.text.default` |
| `color.select.notSelected.subtle` | gray100 | `subtle` = background (confusing) | `color.select.background.default` |

#### Badge Tokens (2 tokens) - ✅ ALREADY CONFORMS

| Current Name | Primitive | Assessment |
|--------------|-----------|------------|
| `color.badge.background.notification` | pink400 | ✅ Follows target pattern |
| `color.badge.text.notification` | white100 | ✅ Follows target pattern |

---

### Category 2: Status/Feedback Tokens (8 tokens) - ❌ MIGRATION REQUIRED

These tokens use `strong/subtle` which doesn't indicate property (background vs text).

| Current Name | Primitive | Issue | Target Name |
|--------------|-----------|-------|-------------|
| `color.success.strong` | green400 | No property, ambiguous use | `color.feedback.text.success` |
| `color.success.subtle` | green100 | No property, ambiguous use | `color.feedback.background.success` |
| `color.warning.strong` | orange400 | No property, ambiguous use | `color.feedback.text.warning` |
| `color.warning.subtle` | orange100 | No property, ambiguous use | `color.feedback.background.warning` |
| `color.error.strong` | pink400 | No property, ambiguous use | `color.feedback.text.error` |
| `color.error.subtle` | pink100 | No property, ambiguous use | `color.feedback.background.error` |
| `color.info.strong` | teal400 | No property, ambiguous use | `color.feedback.text.info` |
| `color.info.subtle` | teal100 | No property, ambiguous use | `color.feedback.background.info` |

**Why `feedback` instead of keeping `success/error/warning/info` as component?**
- Groups related tokens under semantic category
- Aligns with industry patterns (Atlassian uses `color.background.success`)
- Alternative: `color.status.background.success` — needs decision

---

### Category 3: Surface/Layout Tokens (6 tokens)

#### Tokens That Conform (4 tokens) - ✅ NO MIGRATION

| Current Name | Primitive | Assessment |
|--------------|-----------|------------|
| `color.background` | white100 | ✅ Property is the component |
| `color.background.primary.subtle` | purple100 | ✅ Follows pattern |
| `color.surface` | white200 | ✅ Property is the component |
| `color.border` | gray100 | ✅ Property is the component |

#### Tokens Needing Review (2 tokens) - ⚠️ REVIEW REQUIRED

| Current Name | Primitive | Issue | Possible Target |
|--------------|-----------|-------|-----------------|
| `color.canvas` | white100 | Redundant with `color.background`? | Keep or merge with `color.background.canvas` |
| `color.contrast.onPrimary` | white100 | `contrast.on*` pattern | `color.content.onPrimary` or `color.text.onPrimary` |

---

### Category 4: Text/Icon Tokens (4 tokens) - ✅ ALREADY CONFORMS

| Current Name | Primitive | Assessment |
|--------------|-----------|------------|
| `color.text.default` | gray300 | ✅ Follows pattern |
| `color.text.muted` | gray200 | ✅ Follows pattern |
| `color.text.subtle` | gray100 | ✅ Follows pattern |
| `color.icon.default` | gray200 | ✅ Follows pattern |

---

### Category 5: System/Brand Tokens (6 tokens) - ❌ MIGRATION REQUIRED

These tokens lack property and component context.

| Current Name | Primitive | Issue | Target Name Options |
|--------------|-----------|-------|---------------------|
| `color.primary` | purple300 | No property | `color.brand.fill.primary` or `color.action.background.primary` |
| `color.attention` | yellow400 | No property | `color.emphasis.fill.attention` or `color.highlight.background.attention` |
| `color.highlight` | yellow300 | No property | `color.emphasis.background.highlight` |
| `color.tech` | cyan400 | No property | `color.accent.fill.tech` |
| `color.data` | cyan300 | No property | `color.accent.fill.data` |
| `color.print.default` | black100 | Acceptable but review | Keep or `color.media.text.print` |

**Decision Required**: What semantic category should brand/system tokens use?
- Option A: `color.brand.*` for primary
- Option B: `color.action.*` for interactive elements
- Option C: Keep as `color.primary` (exception to pattern)

---

### Category 6: Glow Tokens (5 tokens) - ⚠️ DIFFERENT FAMILY

| Current Name | Primitive | Assessment |
|--------------|-----------|------------|
| `glow.neonPurple` | purple500 | Uses `glow` family, not `color` |
| `glow.neonCyan` | cyan500 | Uses `glow` family, not `color` |
| `glow.neonYellow` | yellow500 | Uses `glow` family, not `color` |
| `glow.neonGreen` | green500 | Uses `glow` family, not `color` |
| `glow.neonPink` | pink500 | Uses `glow` family, not `color` |

**Decision Required**: Should glow tokens follow the same pattern?
- Option A: Keep as `glow.neon*` (effect-specific family)
- Option B: Move to `color.glow.fill.purple` pattern
- Option C: Move to `effect.glow.color.purple` pattern

---

## Phase 2: Migration Scope Summary

### Tokens Requiring Migration (26 total)

| Phase | Category | Token Count | Complexity | Dependencies |
|-------|----------|-------------|------------|--------------|
| 1 | Component (Avatar, Select) | 9 | Medium | 2 components, ~23 files |
| 2 | Status/Feedback | 8 | High | Many components, ~50+ files |
| 3 | Surface/Layout | 2 | Low | Review only |
| 4 | System/Brand | 5 | Medium | Cross-cutting |
| **Total** | | **24-26** | | |

### Tokens Already Conforming (10 total)

| Category | Tokens |
|----------|--------|
| Text | `color.text.default`, `color.text.muted`, `color.text.subtle` |
| Icon | `color.icon.default` |
| Badge | `color.badge.background.notification`, `color.badge.text.notification` |
| Surface | `color.background`, `color.background.primary.subtle`, `color.surface`, `color.border` |

### Tokens Requiring Decision (5 glow + 2 review)

| Token | Decision Needed |
|-------|-----------------|
| `glow.*` (5 tokens) | Keep separate family or integrate into `color.*`? |
| `color.canvas` | Keep or merge with `color.background`? |
| `color.contrast.onPrimary` | Rename to `color.content.onPrimary`? |

---

## Phase 3: Component Dependency Map

### Phase 1 Dependencies (Avatar + Select)

#### Avatar Tokens → Components

| Token | Components | Platform Files | Test Files |
|-------|------------|----------------|------------|
| `color.avatar.*` (5) | Avatar | 3 platforms × ~5 files | ~6 test files |

**Estimated Files**: ~21 files

#### Select Tokens → Components

| Token | Components | Platform Files | Test Files |
|-------|------------|----------------|------------|
| `color.select.*` (4) | Button-VerticalList-Item | Web platform + tests | ~4 test files |

**Estimated Files**: ~8 files

### Phase 2 Dependencies (Status/Feedback)

#### Status Tokens → Components

| Token | Components Using | Estimated Files |
|-------|------------------|-----------------|
| `color.success.*` | Input-Text-Base, form validation, alerts | ~15 files |
| `color.error.*` | Input-Text-Base, Button-VerticalList-*, alerts | ~20 files |
| `color.warning.*` | Alerts, notifications | ~10 files |
| `color.info.*` | Alerts, tooltips | ~10 files |

**Estimated Files**: ~50+ files (high impact)

### Phase 3 Dependencies (Surface/Layout)

| Token | Components Using | Estimated Files |
|-------|------------------|-----------------|
| `color.canvas` | Container-Base, page layouts | ~5 files |
| `color.contrast.onPrimary` | Button-CTA, Button-Icon | ~10 files |

### Phase 4 Dependencies (System/Brand)

| Token | Components Using | Estimated Files |
|-------|------------------|-----------------|
| `color.primary` | Button-CTA, Button-Icon, links, focus states | ~30 files |
| `color.attention` | Notifications, badges | ~5 files |
| `color.highlight` | Text highlighting | ~3 files |
| `color.tech` | Code blocks, technical UI | ~5 files |
| `color.data` | Charts, data visualization | ~5 files |

---

## Phase 4: Documentation Impact

### Steering Documentation

| Document | Tokens Referenced | Update Scope |
|----------|-------------------|--------------|
| `Component-Family-Avatar.md` | 5 avatar tokens | Full update |
| `Component-Family-Button.md` | 4 select + 2 error tokens | Full update |
| `Component-Family-Badge.md` | 2 badge tokens | No change |
| `Token-Family-Color.md` | All color tokens | Major update |
| `Token-Governance.md` | Example references | Update examples |
| `Token-Quick-Reference.md` | Token listings | Full update |
| `Token-Semantic-Structure.md` | Pattern examples | Update examples |

### Component Documentation

| Document | Tokens Referenced | Update Scope |
|----------|-------------------|--------------|
| `Avatar/README.md` | 5 avatar tokens | Full update |
| `Button-VerticalList-Item/README.md` | 4 select + 2 error tokens | Full update |
| `Button-VerticalList-Set/README.md` | Error tokens | Update after Phase 2 |
| `Input-Text-Base/README.md` | Error + success tokens | Update after Phase 2 |
| `Container-Base/README.md` | Surface tokens | Update after Phase 3 |

### Test Files

| Test Category | Files | Update Scope |
|---------------|-------|--------------|
| `ColorTokens.test.ts` | 1 | Major update (all token names) |
| Avatar tests | ~6 | Phase 1 |
| Select/Button tests | ~4 | Phase 1 |
| Input/Form tests | ~10 | Phase 2 |

---

## Phase 5: Decisions Required

### Decision 1: Status Token Semantic Category

**Question**: What should the component segment be for status tokens?

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| A: `feedback` | `color.feedback.background.success` | Groups all status together | New concept |
| B: `status` | `color.status.background.success` | Clear meaning | Similar to current |
| C: Keep flat | `color.background.success` | Simpler | Less structured |

**Recommendation**: Option A (`feedback`) — aligns with industry patterns

### Decision 2: System Token Handling

**Question**: How should `color.primary`, `color.attention`, etc. be structured?

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| A: `brand` | `color.brand.fill.primary` | Clear brand association | May not fit all uses |
| B: `action` | `color.action.background.primary` | Describes interactive use | Narrow scope |
| C: Exception | Keep `color.primary` | Minimal change | Inconsistent pattern |

**Recommendation**: Option C (exception) for now — these are foundational and widely used

### Decision 3: Glow Token Family

**Question**: Should glow tokens follow the same pattern?

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| A: Keep separate | `glow.neonPurple` | Effect-specific family | Different pattern |
| B: Integrate | `color.glow.fill.purple` | Consistent pattern | Longer names |
| C: Effect family | `effect.glow.color.purple` | Extensible for other effects | New family |

**Recommendation**: Option A (keep separate) — glow is an effect, not a color semantic

### Decision 4: Deprecation Strategy

**Question**: How long should deprecated aliases remain?

| Option | Duration | Pros | Cons |
|--------|----------|------|------|
| A: 1 release | ~2-4 weeks | Fast cleanup | Risk for consumers |
| B: 2 releases | ~4-8 weeks | Safer migration | Longer maintenance |
| C: Breaking | Immediate | Clean break | Disruption |

**Recommendation**: Option B (2 releases) — balances cleanup with safety

### Decision 5: Implementation Phasing

**Question**: Should this be one spec or multiple?

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| A: Single spec | All phases in 051 | Complete picture | Large scope |
| B: Multiple specs | 051 (Phase 1), 052 (Phase 2), etc. | Manageable chunks | Coordination overhead |
| C: Hybrid | 051 defines all, implements Phase 1 | Best of both | Partial implementation |

**Recommendation**: Option C (hybrid) — comprehensive design, phased implementation

---

## Phase 6: Recommended Implementation Approach

### Spec 051 Scope (Hybrid Approach)

**Design Phase** (Comprehensive):
1. Define complete target naming convention
2. Document all 40 tokens with current → target mapping
3. Establish migration patterns and deprecation strategy
4. Create Rosetta pipeline updates for new naming

**Implementation Phase 1** (Component Tokens):
1. Migrate Avatar tokens (5)
2. Migrate Select tokens (4)
3. Update affected components
4. Update documentation

**Future Specs** (Deferred Implementation):
- Spec 052: Status/Feedback tokens (8)
- Spec 053: System/Brand tokens (5-6)
- Spec 054: Surface/Layout cleanup (2)

### Migration Order Rationale

1. **Phase 1 (Avatar, Select)**: Lowest blast radius, clear component boundaries
2. **Phase 2 (Status/Feedback)**: High impact but well-defined scope
3. **Phase 3 (Surface/Layout)**: Review and cleanup
4. **Phase 4 (System/Brand)**: Foundational tokens, highest risk

---

## Success Criteria

### Audit Success (This Document)
- [x] All 40 tokens inventoried
- [x] Each token evaluated against target pattern
- [x] Migration scope identified
- [x] Dependencies mapped
- [x] Decisions documented for human review

### Implementation Success (Future)
- [ ] Target naming convention formally defined
- [ ] All Phase 1 tokens migrated
- [ ] Deprecated aliases in place
- [ ] All affected components updated
- [ ] All tests passing
- [ ] All documentation updated
- [ ] No visual regressions

---

## Next Steps

1. **Human Review**: Confirm decisions on semantic categories, exceptions, and phasing
2. **Create Confirmed Actions**: Document approved migration plan
3. **Update Design Outline**: Incorporate comprehensive audit findings
4. **Create Spec Documents**: requirements.md, design.md, tasks.md for Spec 051

---

**Status**: Comprehensive audit complete. Ready for human review and decision confirmation.

