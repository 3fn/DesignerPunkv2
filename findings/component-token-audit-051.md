# Component Token Audit - Spec 051

**Date**: January 24, 2026
**Spec**: 051 - Semantic Token Naming Restructure
**Purpose**: Audit all 15 components for color token usage across primitive, semantic, and component levels
**Status**: Complete

---

## Audit Methodology

For each component, capture:
1. **Primitive tokens** — Direct use of primitive color tokens (potential semantic token candidates)
2. **Semantic tokens** — Current semantic color token usage
3. **Component tokens** — Component-specific color tokens
4. **Hard-coded values** — Any hard-coded colors (should be tokenized)
5. **Alignment assessment** — Does usage align with new naming model?
6. **Gaps identified** — Missing tokens or misalignments
7. **Recommendations** — Suggested changes for Spec 052

---

## Component Inventory (15 Total)

| # | Component | Audit Status | Alignment |
|---|-----------|--------------|-----------|
| 1 | Avatar | ✅ Complete | ❌ Needs migration |
| 2 | Badge-Count-Base | ✅ Complete | ✅ Conforms |
| 3 | Badge-Count-Notification | ✅ Complete | ⚠️ Minor reorder |
| 4 | Badge-Label-Base | ✅ Complete | ✅ Conforms |
| 5 | Button-CTA | ✅ Complete | ❌ Needs migration |
| 6 | Button-Icon | ✅ Complete | ❌ Needs migration |
| 7 | Button-VerticalList-Item | ✅ Complete | ⚠️ Audit state mapping |
| 8 | Button-VerticalList-Set | ✅ Complete | ❌ Needs migration |
| 9 | Container-Base | ✅ Complete | ❌ Needs migration |
| 10 | Container-Card-Base | ✅ Complete | ❌ Needs migration |
| 11 | Icon-Base | ✅ Complete | ✅ Conforms |
| 12 | Input-Text-Base | ✅ Complete | ❌ Needs migration |
| 13 | Input-Text-Email | ✅ Complete | ✅ Inherits from Base |
| 14 | Input-Text-Password | ✅ Complete | ✅ Inherits from Base |
| 15 | Input-Text-PhoneNumber | ✅ Complete | ✅ Inherits from Base |

---

## Component Audits

### 1. Avatar

**Location**: `src/components/core/Avatar/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.avatar.human` | orange300 | Human avatar background |
| **Semantic** | `color.avatar.agent` | teal200 | Agent avatar background (via SVG fill) |
| **Semantic** | `color.avatar.contrast.onHuman` | white100 | Icon color on human avatar |
| **Semantic** | `color.avatar.contrast.onAgent` | white100 | Icon color on agent avatar |
| **Semantic** | `color.avatar.border` | gray100 | Border color (with 48% opacity) |
| **Primitive** | `white-100` | #FFFFFF | xxl border color (full opacity) |

#### CSS Custom Properties Used

```css
--color-avatar-human              /* Human background */
--color-avatar-agent              /* Agent background */
--color-avatar-contrast-on-human  /* Human icon color */
--color-avatar-contrast-on-agent  /* Agent icon color */
--color-avatar-border             /* Border color */
--white-100                       /* xxl border (primitive) */
```

#### Hard-coded Values

| Value | Location | Recommendation |
|-------|----------|----------------|
| `48%` | Border opacity in `color-mix()` | Acceptable - references `opacity.heavy` token conceptually |

#### Alignment Assessment

**Current state**: Uses component-specific semantic tokens (`color.avatar.*`)

**Alignment with new model**:
- ❌ `color.avatar.human` → Should become `color.identity.human` (semantic) + `color.avatar.human.background` (component reference)
- ❌ `color.avatar.agent` → Should become `color.identity.agent` (semantic) + `color.avatar.agent.background` (component reference)
- ❌ `color.avatar.contrast.onHuman` → Should become `color.contrast.onDark` (semantic) + `color.avatar.human.icon` (component reference)
- ❌ `color.avatar.contrast.onAgent` → Should become `color.contrast.onDark` (semantic) + `color.avatar.agent.icon` (component reference)
- ⚠️ `color.avatar.border` → Could stay as-is or become `color.avatar.default.border`
- ⚠️ `white-100` primitive for xxl border → Should use semantic token

#### Gaps Identified

1. **Missing semantic tokens**:
   - `color.identity.human` (new)
   - `color.identity.agent` (new)
   - `color.contrast.onDark` (new - replaces `color.contrast.onPrimary`)
   - `color.contrast.onLight` (new)

2. **Primitive token usage**:
   - `white-100` used directly for xxl border - should use `color.contrast.onDark` or similar

#### Recommendations for Spec 052

1. Create `color.identity.human` = orange300
2. Create `color.identity.agent` = teal200
3. Create `color.contrast.onDark` = white100
4. Create `color.contrast.onLight` = black500
5. Update component tokens to reference semantic tokens:
   - `color.avatar.human.background` → `color.identity.human`
   - `color.avatar.agent.background` → `color.identity.agent`
   - `color.avatar.human.icon` → `color.contrast.onDark`
   - `color.avatar.agent.icon` → `color.contrast.onDark`
6. Replace `white-100` primitive with `color.contrast.onDark` for xxl border

---

### 2. Badge-Count-Base

**Location**: `src/components/core/Badge-Count-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.surface` | white200 | Badge background |
| **Semantic** | `color.text.default` | gray300 | Badge text color |

#### CSS Custom Properties Used

```css
--color-surface              /* Badge background */
--color-text-default         /* Badge text color */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens that already conform to the target pattern.

**Alignment with new model**:
- ✅ `color.surface` — Already conforms (property IS the concept)
- ✅ `color.text.default` — Already conforms (follows `color.{property}.{variant}` pattern)

#### Gaps Identified

None — Badge-Count-Base is fully aligned with the new naming model.

#### Recommendations for Spec 052

No changes required. This component serves as a reference implementation for proper semantic token usage.

---



### 3. Badge-Count-Notification

**Location**: `src/components/core/Badge-Count-Notification/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.badge.background.notification` | pink400 | Badge background |
| **Semantic** | `color.badge.text.notification` | white100 | Badge text color |

#### CSS Custom Properties Used

```css
--color-badge-background-notification  /* Badge background */
--color-badge-text-notification        /* Badge text color */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens that already conform to the target pattern.

**Alignment with new model**:
- ⚠️ `color.badge.background.notification` → Minor reorder to `color.badge.notification.background` (variant before property)
- ⚠️ `color.badge.text.notification` → Minor reorder to `color.badge.notification.text` (variant before property)

#### Gaps Identified

Minor naming reorder needed to match `{component}.{variant}.{property}` pattern.

#### Recommendations for Spec 052

1. Rename `color.badge.background.notification` → `color.badge.notification.background`
2. Rename `color.badge.text.notification` → `color.badge.notification.text`

---

### 4. Badge-Label-Base

**Location**: `src/components/core/Badge-Label-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.surface` | white200 | Badge background |
| **Semantic** | `color.text.default` | gray300 | Badge text color |

#### CSS Custom Properties Used

```css
--color-surface              /* Badge background */
--color-text-default         /* Badge text color */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens that already conform to the target pattern.

**Alignment with new model**:
- ✅ `color.surface` — Already conforms
- ✅ `color.text.default` — Already conforms

#### Gaps Identified

None — Badge-Label-Base is fully aligned with the new naming model.

#### Recommendations for Spec 052

No changes required.

---

### 5. Button-CTA

**Location**: `src/components/core/Button-CTA/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.primary` | purple300 | Primary button background |
| **Semantic** | `color.contrast.onPrimary` | white100 | Primary button text/icon |
| **Semantic** | `color.background` | white100 | Secondary button background |
| **Semantic** | `color.print.default` | black100 | Print media color |
| **Component** | `--_cta-hover-bg` | blend calculation | Hover state (8% darker) |
| **Component** | `--_cta-pressed-bg` | blend calculation | Pressed state (12% darker) |
| **Component** | `--_cta-disabled-bg` | blend calculation | Disabled state |
| **Component** | `--_cta-icon-optical` | blend calculation | Icon optical balance |

#### CSS Custom Properties Used

```css
--color-primary              /* Primary button background */
--color-contrast-on-primary  /* Primary button text/icon */
--color-background           /* Secondary button background */
--color-print-default        /* Print media */
--border-default             /* Secondary button border width */
```

#### Hard-coded Values

| Value | Location | Recommendation |
|-------|----------|----------------|
| `56px`, `72px`, `80px` | Min-width values | Consider tokenizing as component tokens |

#### Alignment Assessment

**Current state**: Uses semantic tokens with blend utilities for state colors.

**Alignment with new model**:
- ❌ `color.primary` → Should become `color.action.primary`
- ❌ `color.contrast.onPrimary` → Should become `color.contrast.onDark`
- ✅ `color.background` — Already conforms
- ✅ `color.print.default` — Already conforms

#### Gaps Identified

1. **Missing semantic tokens**:
   - `color.action.primary` (replaces `color.primary`)
   - `color.action.secondary` (new - for de-emphasized actions)
   - `color.contrast.onDark` (replaces `color.contrast.onPrimary`)

2. **Component token opportunity**:
   - Min-width values could be tokenized

#### Recommendations for Spec 052

1. Create `color.action.primary` = purple300
2. Create `color.action.secondary` = black400 (for repetitive action lists)
3. Create `color.contrast.onDark` = white100
4. Update Button-CTA to use new semantic tokens
5. Consider adding `emphasis` prop to switch between primary/secondary colors

---

### 6. Button-Icon

**Location**: `src/components/core/Button-Icon/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.primary` | purple300 | Primary button background, secondary/tertiary icon |
| **Semantic** | `color.contrast.onPrimary` | white100 | Primary button icon |
| **Semantic** | `color.background.primary.subtle` | purple100 | Secondary hover background |
| **Semantic** | `color.print.default` | black100 | Print media color |
| **Component** | `--_bi-hover-bg` | blend calculation | Hover state |
| **Component** | `--_bi-pressed-bg` | blend calculation | Pressed state |

#### CSS Custom Properties Used

```css
--color-primary                    /* Primary background, secondary/tertiary icon */
--color-contrast-on-primary        /* Primary icon color */
--color-background-primary-subtle  /* Secondary hover background */
--color-print-default              /* Print media */
```

#### Hard-coded Values

| Value | Location | Recommendation |
|-------|----------|----------------|
| `4px` | Focus buffer | Uses accessibility tokens conceptually |

#### Alignment Assessment

**Current state**: Uses semantic tokens with blend utilities for state colors.

**Alignment with new model**:
- ❌ `color.primary` → Should become `color.action.primary`
- ❌ `color.contrast.onPrimary` → Should become `color.contrast.onDark`
- ✅ `color.background.primary.subtle` — Already conforms
- ✅ `color.print.default` — Already conforms

#### Gaps Identified

Same as Button-CTA — needs action concept tokens.

#### Recommendations for Spec 052

1. Update to use `color.action.primary` instead of `color.primary`
2. Update to use `color.contrast.onDark` instead of `color.contrast.onPrimary`

---

### 7. Button-VerticalList-Item

**Location**: `src/components/core/Button-VerticalList-Item/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.text.muted` | gray200 | Description text color |
| **Component** | `--_vlbi-background` | state-dependent | Background per visual state |
| **Component** | `--_vlbi-border-color` | state-dependent | Border per visual state |
| **Component** | `--_vlbi-label-color` | state-dependent | Label color per visual state |
| **Component** | `--_vlbi-icon-color` | state-dependent | Icon color per visual state |
| **Component** | `--_vlbi-hover-bg` | blend calculation | Hover state |
| **Component** | `--_vlbi-pressed-bg` | blend calculation | Pressed state |

#### CSS Custom Properties Used

```css
--color-text-muted           /* Description text */
/* State-dependent colors set via inline styles from visualStateMapping.ts */
```

#### Hard-coded Values

None — all colors use tokens or blend utilities.

#### Alignment Assessment

**Current state**: Uses component-scoped CSS custom properties with state-dependent values from visualStateMapping.ts.

**Alignment with new model**:
- ✅ `color.text.muted` — Already conforms
- ⚠️ State colors (select.selected.strong, etc.) — Need to check visualStateMapping.ts

#### Gaps Identified

Need to audit `visualStateMapping.ts` for select token usage.

#### Recommendations for Spec 052

1. Audit visualStateMapping.ts for select token references
2. Update select tokens to use `color.feedback.select.*` pattern

---

### 8. Button-VerticalList-Set

**Location**: `src/components/core/Button-VerticalList-Set/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.error.strong` | pink400 | Error message text |
| **Semantic** | `color.print.default` | black100 | Print media color |

#### CSS Custom Properties Used

```css
--color-error-strong         /* Error message text */
--color-print-default        /* Print media */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens.

**Alignment with new model**:
- ❌ `color.error.strong` → Should become `color.feedback.error.text`
- ✅ `color.print.default` — Already conforms

#### Gaps Identified

Error token needs migration to feedback concept.

#### Recommendations for Spec 052

1. Update to use `color.feedback.error.text` instead of `color.error.strong`

---

### 9. Container-Base

**Location**: `src/components/core/Container-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.primary` | purple300 | Focus outline color |
| **Semantic** | `color.surface` | white200 | Background (via token-mapping) |
| **Semantic** | `color.background` | white100 | Background (via token-mapping) |
| **Semantic** | `color.border` | gray100 | Border color (via token-mapping) |

#### CSS Custom Properties Used

```css
--color-primary              /* Focus outline */
--color-surface              /* Background option */
--color-background           /* Background option */
--color-border               /* Border color */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens via token-mapping system.

**Alignment with new model**:
- ❌ `color.primary` (focus) → Should use `accessibility.focus.color` token
- ✅ `color.surface` — Already conforms
- ✅ `color.background` — Already conforms
- ✅ `color.border` — Already conforms

#### Gaps Identified

Focus outline should use accessibility token, not color.primary directly.

#### Recommendations for Spec 052

1. Update focus outline to use `--accessibility-focus-color` instead of `--color-primary`

---

### 10. Container-Card-Base

**Location**: `src/components/core/Container-Card-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.surface.primary` | (via token map) | Default card background |
| **Semantic** | `color.surface` | white200 | Fallback background |
| **Semantic** | `color.primary` | purple300 | Focus outline color |
| **Component** | `--_card-hover-bg` | blend calculation | Hover state |
| **Component** | `--_card-pressed-bg` | blend calculation | Pressed state |

#### CSS Custom Properties Used

```css
--color-surface-primary      /* Default card background */
--color-surface              /* Fallback background */
--color-primary              /* Focus outline */
```

#### Hard-coded Values

| Value | Location | Recommendation |
|-------|----------|----------------|
| `#A855F7` | Focus outline fallback | Should use token reference |

#### Alignment Assessment

**Current state**: Uses semantic tokens with blend utilities for interactive states.

**Alignment with new model**:
- ✅ `color.surface.primary` — Already conforms
- ✅ `color.surface` — Already conforms
- ❌ `color.primary` (focus) → Should use `accessibility.focus.color` token
- ⚠️ Hard-coded `#A855F7` fallback should be removed

#### Gaps Identified

1. Focus outline should use accessibility token
2. Hard-coded color fallback should be removed

#### Recommendations for Spec 052

1. Update focus outline to use `--accessibility-focus-color`
2. Remove hard-coded `#A855F7` fallback

---

### 11. Icon-Base

**Location**: `src/components/core/Icon-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.print.default` | black100 | Print media color |
| **Inherited** | `currentColor` | parent | Default icon color |

#### CSS Custom Properties Used

```css
--color-print-default        /* Print media */
/* Icons inherit color from parent via currentColor */
```

#### Hard-coded Values

None — icons inherit color from parent.

#### Alignment Assessment

**Current state**: Uses color inheritance pattern (currentColor) with print token.

**Alignment with new model**:
- ✅ `color.print.default` — Already conforms
- ✅ Color inheritance pattern — Correct approach for icons

#### Gaps Identified

None — Icon-Base is fully aligned with the new naming model.

#### Recommendations for Spec 052

No changes required.

---

### 12. Input-Text-Base

**Location**: `src/components/core/Input-Text-Base/`
**Audit Status**: ✅ Complete

#### Token Usage

| Token Level | Token Name | Value/Reference | Usage Context |
|-------------|------------|-----------------|---------------|
| **Semantic** | `color.text.default` | gray300 | Input text color |
| **Semantic** | `color.text.muted` | gray200 | Label, helper text, disabled text |
| **Semantic** | `color.background` | white100 | Input background |
| **Semantic** | `color.border` | gray100 | Default border |
| **Semantic** | `color.primary` | purple300 | Focus border (via blend) |
| **Semantic** | `color.error.strong` | pink400 | Error state border/label |
| **Semantic** | `color.success.strong` | green400 | Success state border/label |
| **Component** | `--_itb-focus-color` | blend calculation | Focus state color |
| **Component** | `--_itb-disabled-color` | blend calculation | Disabled state color |

#### CSS Custom Properties Used

```css
--color-text-default         /* Input text */
--color-text-muted           /* Label, helper, disabled */
--color-background           /* Input background */
--color-border               /* Default border */
--color-primary              /* Focus border (via blend) */
--color-error-strong         /* Error state */
--color-success-strong       /* Success state */
```

#### Hard-coded Values

None — all colors use semantic tokens.

#### Alignment Assessment

**Current state**: Uses semantic tokens with blend utilities for state colors.

**Alignment with new model**:
- ✅ `color.text.default` — Already conforms
- ✅ `color.text.muted` — Already conforms
- ✅ `color.background` — Already conforms
- ✅ `color.border` — Already conforms
- ❌ `color.error.strong` → Should become `color.feedback.error.text`
- ❌ `color.success.strong` → Should become `color.feedback.success.text`

#### Gaps Identified

Error and success tokens need migration to feedback concept.

#### Recommendations for Spec 052

1. Update to use `color.feedback.error.text` instead of `color.error.strong`
2. Update to use `color.feedback.success.text` instead of `color.success.strong`

---

### 13. Input-Text-Email

**Location**: `src/components/core/Input-Text-Email/`
**Audit Status**: ✅ Complete

#### Token Usage

Inherits all token usage from Input-Text-Base. No additional color tokens.

#### Alignment Assessment

**Current state**: Composition pattern — wraps Input-Text-Base.

**Alignment with new model**: Inherits alignment status from Input-Text-Base.

#### Gaps Identified

None — inherits from Input-Text-Base.

#### Recommendations for Spec 052

No direct changes required — will inherit updates from Input-Text-Base.

---

### 14. Input-Text-Password

**Location**: `src/components/core/Input-Text-Password/`
**Audit Status**: ✅ Complete

#### Token Usage

Inherits all token usage from Input-Text-Base. No additional color tokens.

#### Alignment Assessment

**Current state**: Composition pattern — wraps Input-Text-Base.

**Alignment with new model**: Inherits alignment status from Input-Text-Base.

#### Gaps Identified

None — inherits from Input-Text-Base.

#### Recommendations for Spec 052

No direct changes required — will inherit updates from Input-Text-Base.

---

### 15. Input-Text-PhoneNumber

**Location**: `src/components/core/Input-Text-PhoneNumber/`
**Audit Status**: ✅ Complete

#### Token Usage

Inherits all token usage from Input-Text-Base. No additional color tokens.

#### Alignment Assessment

**Current state**: Composition pattern — wraps Input-Text-Base.

**Alignment with new model**: Inherits alignment status from Input-Text-Base.

#### Gaps Identified

None — inherits from Input-Text-Base.

#### Recommendations for Spec 052

No direct changes required — will inherit updates from Input-Text-Base.

---

## Audit Summary

### Components by Alignment Status

| Status | Count | Components |
|--------|-------|------------|
| ✅ Fully Conforms | 5 | Badge-Count-Base, Badge-Label-Base, Icon-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber |
| ⚠️ Minor Changes | 2 | Badge-Count-Notification (reorder), Button-VerticalList-Item (audit state mapping) |
| ❌ Needs Migration | 8 | Avatar, Button-CTA, Button-Icon, Button-VerticalList-Set, Container-Base, Container-Card-Base, Input-Text-Base |

### New Semantic Tokens Required

| Token | Value | Concept | Used By |
|-------|-------|---------|---------|
| `color.identity.human` | orange300 | Identity | Avatar |
| `color.identity.agent` | teal200 | Identity | Avatar |
| `color.action.primary` | purple300 | Action | Button-CTA, Button-Icon |
| `color.action.secondary` | black400 | Action | Button-CTA (new emphasis prop) |
| `color.contrast.onDark` | white100 | Contrast | Avatar, Button-CTA, Button-Icon |
| `color.contrast.onLight` | black500 | Contrast | (future use) |
| `color.feedback.error.text` | pink400 | Feedback | Button-VerticalList-Set, Input-Text-Base |
| `color.feedback.error.background` | pink100 | Feedback | (future use) |
| `color.feedback.success.text` | green400 | Feedback | Input-Text-Base |
| `color.feedback.success.background` | green100 | Feedback | (future use) |
| `color.feedback.warning.text` | orange400 | Feedback | (future use) |
| `color.feedback.warning.background` | orange100 | Feedback | (future use) |
| `color.feedback.info.text` | teal400 | Feedback | (future use) |
| `color.feedback.info.background` | teal100 | Feedback | (future use) |
| `color.feedback.select.text.rest` | cyan400 | Feedback | Button-VerticalList-Item |
| `color.feedback.select.background.rest` | cyan100 | Feedback | Button-VerticalList-Item |
| `color.feedback.select.text.default` | gray200 | Feedback | Button-VerticalList-Item |
| `color.feedback.select.background.default` | gray100 | Feedback | Button-VerticalList-Item |

### Token Migrations Required

| Current Token | New Token | Components Affected |
|---------------|-----------|---------------------|
| `color.primary` | `color.action.primary` | Button-CTA, Button-Icon, Container-Base, Container-Card-Base |
| `color.contrast.onPrimary` | `color.contrast.onDark` | Button-CTA, Button-Icon |
| `color.avatar.human` | `color.identity.human` | Avatar |
| `color.avatar.agent` | `color.identity.agent` | Avatar |
| `color.error.strong` | `color.feedback.error.text` | Button-VerticalList-Set, Input-Text-Base |
| `color.error.subtle` | `color.feedback.error.background` | (future use) |
| `color.success.strong` | `color.feedback.success.text` | Input-Text-Base |
| `color.success.subtle` | `color.feedback.success.background` | (future use) |
| `color.warning.strong` | `color.feedback.warning.text` | (future use) |
| `color.warning.subtle` | `color.feedback.warning.background` | (future use) |
| `color.info.strong` | `color.feedback.info.text` | (future use) |
| `color.info.subtle` | `color.feedback.info.background` | (future use) |
| `color.select.selected.strong` | `color.feedback.select.text.rest` | Button-VerticalList-Item |
| `color.select.selected.subtle` | `color.feedback.select.background.rest` | Button-VerticalList-Item |
| `color.select.notSelected.strong` | `color.feedback.select.text.default` | Button-VerticalList-Item |
| `color.select.notSelected.subtle` | `color.feedback.select.background.default` | Button-VerticalList-Item |
| `color.badge.background.notification` | `color.badge.notification.background` | Badge-Count-Notification |
| `color.badge.text.notification` | `color.badge.notification.text` | Badge-Count-Notification |

### Hard-coded Values to Address

| Component | Value | Recommendation |
|-----------|-------|----------------|
| Button-CTA | `56px`, `72px`, `80px` min-widths | Consider component tokens |
| Container-Card-Base | `#A855F7` fallback | Remove, use token reference |

---

## Next Steps

1. ✅ Component audit complete
2. ⏳ Update design-outline.md with complete audit findings
3. ⏳ Finalize token migration mapping
4. ⏳ Create Spec 052 for implementation
